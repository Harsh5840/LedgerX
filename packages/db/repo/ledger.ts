import { PrismaClient, Prisma } from '@prisma/client';
import { Transaction } from '@ledgerX/core/src/types';

const prisma = new PrismaClient();



export async function addTransaction(tx: Transaction) {
  await prisma.$transaction([   // $transaction is a prisma method that allows you to run multiple database operations in a single transaction where transaction is atomic and all or nothing
    prisma.ledgerEntry.create({ data: tx.debit as unknown as Prisma.LedgerEntryUncheckedCreateInput}),  // create a new ledger entry for the debit transaction
    prisma.ledgerEntry.create({ data: tx.credit as unknown as Prisma.LedgerEntryUncheckedCreateInput}), // create a new ledger entry for the credit transaction
  ]);
}


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
    const start = new Date(year, filters.month - 1, 1); // month is 0-indexed in javascript so we subtract 1 for example for january we use 0 and for february we use 1 and we put 1 for the day
    const end = new Date(year, filters.month, 1); // we put 1 for the day
    where.timestamp = { gte: start, lt: end };  // gte: greater than or equal to, lt: less than
  }

  const result = await prisma.ledgerEntry.aggregate({
    _sum: { amount: true },  // _sum is a prisma method that allows you to aggregate the amount of the ledger entries
    where, // where is the filter we applied to the ledger entries
  });

  return result._sum.amount || 0;
}


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

  const totalsByCategory: Record<string, number> = {}; // Record is a type that allows you to store a key-value pair where the key is a string and the value is a number

  for (const entry of entries) {
    const category = entry.category || "others"; // if the category is not found, we set it to "others"
    totalsByCategory[category] = (totalsByCategory[category] || 0) + entry.amount;
  }

  return Object.entries(totalsByCategory) // Object.entries is a method that allows you to get the entries of an object
    .sort((a, b) => b[1] - a[1]) // sort the entries by the amount
    .slice(0, limit);
}

export async function getAllTransactions(userId: string) {
  return await prisma.ledgerEntry.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' }
  });
}
