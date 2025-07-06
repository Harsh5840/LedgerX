import { parseQuery } from "./nlp";
import { prisma } from "@ledgerX/db/src/client";
import { ruleBasedScore } from "./rules";
import { mlRiskScore } from "./model";
import { LedgerEntry } from "@ledgerx/core";

// --- 1. Handle natural language queries ---
export async function executeUserQuery(query: string, userId: string) {
  const parsed = parseQuery(query);

  if (!parsed || parsed.intent === "UNKNOWN") {
    console.warn(`Unrecognized query from user ${userId}: "${query}"`);
    return "Sorry, I couldn't understand your question.";
  }

  switch (parsed.intent) {
    case "TOTAL_SPENT":
      return await handleSpendingSummary(userId, parsed.filters);
    case "TOP_CATEGORIES":
      return await handleTopCategories(userId, parsed.filters, parsed.limit ?? 3);
    default:
      return "Sorry, I don't support that type of query yet.";
  }
}

async function handleSpendingSummary(
  userId: string,
  filters: { category?: string; month?: number; year?: number }
) {
  const now = new Date();
  const month = filters.month !== undefined ? filters.month - 1 : now.getMonth(); // month is 0-indexed
  const year = filters.year ?? now.getFullYear();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const { _sum } = await prisma.ledgerEntry.aggregate({
    where: {
      userId,
      type: "debit",
      timestamp: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
      ...(filters.category && { category: filters.category }),
    },
    _sum: { amount: true },
  });

  const total = _sum.amount ?? 0;

  return `You spent ₹${total} on ${filters.category || "all categories"} in ${startDate.toLocaleString('default', { month: 'long' })}, ${year}.`;
}

async function handleTopCategories(
  userId: string,
  filters: { month?: number; year?: number },
  limit: number
) {
  const now = new Date();
  const month = filters.month !== undefined ? filters.month - 1 : now.getMonth();
  const year = filters.year ?? now.getFullYear();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      userId,
      type: "debit",
      timestamp: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
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
  return `Top ${limit} spending categories in ${startDate.toLocaleString('default', {
    month: 'long',
  })}, ${year}:\n` + lines.join("\n");
}

// --- 2. Evaluate anomaly risk score (for fraud detection) ---
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
