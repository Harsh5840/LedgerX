// packages/db/repo/transaction.ts

import { prisma } from "../src/client";

export async function createTransaction(data: {
  userId: string;
  amount: number;
  category: string;
  timestamp: Date;
  riskScore: number;
  isFlagged: boolean;
  reasons: string;
}) {
  return prisma.transaction.create({ data });
}

export async function getAllTransactions() {
  return prisma.transaction.findMany({ orderBy: { timestamp: "desc" } });
}

export async function reverseTransaction(transactionId: string) {
  const original = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!original) throw new Error("Transaction not found");

  const reversed = {
    userId: original.userId,
    amount: -original.amount,
    category: original.category,
    timestamp: new Date(),
    riskScore: 0,
    isFlagged: false,
    reasons: "Reversal",
    parentId: original.id,
  };

  return prisma.transaction.create({ data: reversed });
}
