import { PrismaClient, Prisma, LedgerEntry } from "@prisma/client";
import { Transaction } from "@ledgerX/core";
const prisma = new PrismaClient();

/**
 * Add a transaction: atomic debit + credit ledger entries
 */
export async function addTransaction(tx: { debit: LedgerEntry; credit: LedgerEntry }) {
  const transactionId = tx.debit.transactionId;

  await prisma.$transaction([
    prisma.ledgerEntry.create({
      data: {
        ...tx.debit,
        transactionId,
      } as Prisma.LedgerEntryUncheckedCreateInput,
    }),
    prisma.ledgerEntry.create({
      data: {
        ...tx.credit,
        transactionId,
      } as Prisma.LedgerEntryUncheckedCreateInput,
    }),
  ]);
}

/**
 * Get total debit spending for a user with optional filters
 */
export async function getTotalSpending(
  userId: string,
  filters?: { category?: string; month?: number }
): Promise<number> {
  const where: Prisma.LedgerEntryWhereInput = {
    userId,
    type: "debit",
  };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.month) {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, filters.month - 1, 1);
    const end = new Date(year, filters.month, 1);
    where.timestamp = { gte: start, lt: end };
  }

  const result = await prisma.ledgerEntry.aggregate({
    _sum: { amount: true },
    where,
  });

  return result._sum.amount || 0;
}

/**
 * Get top categories by amount spent
 */
export async function getTopCategories(
  userId: string,
  limit = 5
): Promise<[string, number][]> {
  const entries = await prisma.ledgerEntry.findMany({
    where: {
      userId,
      type: "debit",
    },
    select: {
      category: true,
      amount: true,
    },
  });

  const totalsByCategory: Record<string, number> = {};

  for (const entry of entries) {
    const category = entry.category || "others";
    totalsByCategory[category] =
      (totalsByCategory[category] || 0) + entry.amount;
  }

  return Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

/**
 * Get all ledger entries for a user
 */
export async function getAllTransactions(userId: string) {
 return await prisma.ledgerEntry.findMany({
  where: { userId },
  include: { transaction: true },
  orderBy: { timestamp: "desc" },
});
}