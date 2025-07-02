import { prisma } from "@ledgerX/db";
import { z } from "zod";

// ✅ Define Zod schema
const FiltersSchema = z.object({
  userId: z.string().optional(),
  category: z.string().optional(),
  month: z.number().min(0).max(11).optional(),
  year: z.number().min(1970).max(2100).optional(),
});

type Filters = z.infer<typeof FiltersSchema>;

export const getTotalSpendingWithFilters = async (filters: Filters): Promise<number> => {
  const validated = FiltersSchema.parse(filters);
  const { userId, category, month, year } = validated;

  const where: any = { type: "debit" };

  if (userId) where.userId = userId;
  if (category) where.category = category;

  if (month !== undefined && year !== undefined) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    where.timestamp = { gte: start, lt: end };
  }

  const result = await prisma.ledgerEntry.aggregate({
    _sum: { amount: true },
    where,
  });

  return result._sum.amount || 0;
};

export const getTopCategoriesWithFilters = async (
  filters: Filters,
  limit: number = 3
): Promise<{ category: string; total: number }[]> => {
  const validated = FiltersSchema.parse(filters);
  const { userId, month, year } = validated;

  const where: any = { type: "debit" };

  if (userId) where.userId = userId;
  if (month !== undefined && year !== undefined) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    where.timestamp = { gte: start, lt: end };
  }

  const results = await prisma.ledgerEntry.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    category: r.category ?? "uncategorized",
    total: r._sum.amount ?? 0,
  }));
};

// 📊 Monthly trend for the past 6 months
export const getMonthlySpendingTrend = async (userId: string): Promise<{ month: string; total: number }[]> => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const results = await prisma.ledgerEntry.groupBy({
    by: ["timestamp"],
    where: {
      userId,
      type: "debit",
      timestamp: { gte: sixMonthsAgo },
    },
    _sum: { amount: true },
  });

  // Bucket into months manually
  const monthTotals: Record<string, number> = {};

  for (const entry of results) {
    const date = new Date(entry.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthTotals[key] = (monthTotals[key] || 0) + (entry._sum.amount || 0);
  }

  return Object.entries(monthTotals).map(([month, total]) => ({ month, total }));
};

export const getFlaggedOrRiskyEntries = async (userId: string): Promise<any[]> => {
  return prisma.ledgerEntry.findMany({
    where: {
      userId,
      OR: [
        { flagged: true },
        { riskScore: { gte: 50 } }, // Adjustable threshold
      ],
    },
    orderBy: { timestamp: "desc" },
  });
};
