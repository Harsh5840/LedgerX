import prisma from "@prisma/client" ;


import { Transaction } from '@ledgerX/core/src/types';

/**
 * Saves a debit-credit transaction pair to the database.
 */
export async function addTransaction(tx: Transaction) {
  await prisma.$transaction([
    prisma.ledgerEntry.create({ data: tx.debit }),
    prisma.ledgerEntry.create({ data: tx.credit }),
  ]);
}

/**
 * Returns total spending for a user, optionally filtered by category or month.
 */
export async function getTotalSpending(userId: string, filters?: { category?: string; month?: number }) {
  const where: any = {
    userId,
    type: 'debit',
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
 * Returns top spending categories by total amount.
 */
export async function getTopCategories(userId: string, limit = 5) {
  const entries = await prisma.ledgerEntry.findMany({
    where: {
      userId,
      type: 'debit',
    },
    select: {
      category: true,
      amount: true,
    },
  });

  const totalsByCategory: Record<string, number> = {};

  for (const entry of entries) {
    const category = entry.category || "others";
    totalsByCategory[category] = (totalsByCategory[category] || 0) + entry.amount;
  }

  return Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

/**
 * Returns all transactions for a user.
 */
export async function getAllTransactions(userId: string) {
  return await prisma.ledgerEntry.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' }
  });
}
