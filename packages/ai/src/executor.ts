import { parseQuery } from "./nlp";
import { prisma } from "@repo/db/src/client";


export async function executeUserQuery(query: string, userId: string) {
  const parsed = parseQuery(query);

  if (!parsed || parsed.intent === "UNKNOWN") {
    return "Sorry, I couldn't understand your question.";
  }

  switch (parsed.intent) {
    case "TOTAL_SPENT":
      return await handleSpendingSummary(userId, parsed.filters);
    case "TOP_CATEGORIES":
      return await handleTopCategories(userId, parsed.filters, parsed.limit || 3);
    default:
      return "Sorry, I don't support that type of query yet.";
  }
}

                            
async function handleSpendingSummary(
  userId: string,
  filters: { category?: string; month?: number; year?: number }
) {
  const now = new Date();
  const month = filters.month ?? now.getMonth();
  const year = filters.year ?? now.getFullYear();

  const startDate = new Date(year, month, 1);  //the 1 is for mentioning the first day of the month
  const endDate = new Date(year, month + 1, 0);  //the 0 is for mentioning the last day of the month

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      userId,
      type: "debit",
      timestamp: {
        gte: startDate.toISOString(), //gte is greater than or equal to
        lte: endDate.toISOString(), //lte is less than or equal to
      },
      ...(filters.category && { category: filters.category }),  //the ...(filters.category && { category: filters.category }) is for mentioning the category of the query
    },
  });

  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);  //the reduce function is used to sum up the amount of the entries

  return `You spent ₹${total} on ${filters.category || "all categories"} in ${startDate.toLocaleString('default', { month: 'long' })}.`;
}

// Handles "Top N categories" query (optional enhancement)
async function handleTopCategories(
  userId: string,
  filters: { month?: number; year?: number },
  limit: number
) {
  const now = new Date();
  const month = filters.month ?? now.getMonth();
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
  });

  const totalsByCategory: Record<string, number> = {};  //the Record<string, number> is used to store the total amount of the categories

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
  return `Top ${limit} spending categories:\n` + lines.join("\n");
}
