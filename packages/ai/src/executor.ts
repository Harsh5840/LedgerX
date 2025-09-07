import { parseQuery } from "./nlp";
import { prisma } from "@ledgerX/db/src/client";
import { ruleBasedScore } from "./rules";
import { mlRiskScore } from "./model";
import { LedgerEntry } from "@ledgerX/types";

// --- 1. Handle natural language queries ---
export async function executeUserQuery(query: string, userId: string) {
  const parsed = parseQuery(query);

  if (!parsed || parsed.intent === "UNKNOWN") {
    return "Sorry, I couldn't understand your question.";
  }

  switch (parsed.intent) {
    case "TOTAL_SPENT":
      return await getTotalSpent(userId, parsed.filters);
    case "TOP_CATEGORIES":
      return await getTopSpendingCategories(userId, parsed.filters, parsed.limit ?? 3);
    default:
      return "Sorry, I don't support that type of query yet.";
  }
}

// --- 2. Core logic for total spent (used by both AI and service layers) ---
export async function getTotalSpent(
  userId: string,
  filters: { category?: string; month?: number; year?: number }
): Promise<string> {
  const now = new Date();
  const month = filters.month !== undefined ? filters.month - 1 : now.getMonth();
  const year = filters.year ?? now.getFullYear();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const { _sum } = await prisma.ledgerEntry.aggregate({
    where: {
      userId,
      type: "debit",
      timestamp: { gte: start.toISOString(), lte: end.toISOString() },
      ...(filters.category && { category: filters.category }),
    },
    _sum: { amount: true },
  });

  const total = _sum.amount ?? 0;
  return `You spent ₹${total} on ${filters.category || "all categories"} in ${start.toLocaleString("default", {
    month: "long",
  })}, ${year}.`;
}

// --- 3. Core logic for top categories ---
export async function getTopSpendingCategories(
  userId: string,
  filters: { month?: number; year?: number },
  limit: number
): Promise<string> {
  const now = new Date();
  const month = filters.month !== undefined ? filters.month - 1 : now.getMonth();
  const year = filters.year ?? now.getFullYear();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      userId,
      type: "debit",
      timestamp: { gte: start.toISOString(), lte: end.toISOString() },
    },
    select: {
      category: true,
      amount: true,
    },
  });

  const totalsByCategory: Record<string, number> = {};
  for (const entry of entries) {
    const category = entry.category || "uncategorized";
    totalsByCategory[category] = (totalsByCategory[category] || 0) + entry.amount;
  }

  const top = Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (top.length === 0) {
    return "No spending data found for that period.";
  }

  const lines = top.map(([cat, amt], i) => `${i + 1}. ₹${amt} on ${cat}`);
  return `Top ${limit} spending categories in ${start.toLocaleString("default", {
    month: "long",
  })}, ${year}:\n${lines.join("\n")}`;
}

// --- 4. Evaluate anomaly risk score ---
export async function evaluateAnomaly(entry: LedgerEntry) {
  const ruleScore = ruleBasedScore(entry);
  const mlScore = await mlRiskScore(entry);

  const totalScore = (ruleScore + mlScore) / 2;

  const riskLevel =
    totalScore >= 70 ? "high" :
    totalScore >= 40 ? "medium" :
    "low";

  return {
    ruleScore,
    mlScore,
    totalScore,
    riskLevel,
  };
}
