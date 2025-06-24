import { prisma } from "@ledgerx/db";
import { LedgerEntry } from "@ledgerx/core";
import { analyzeFraud } from "./fraudService";

/**
 * Create a transaction and persist to DB with fraud analysis
 */
export async function createTransaction(entry: LedgerEntry) {
  const fraudResult = await analyzeFraud(entry);

  const transaction = await prisma.transaction.create({
    data: {
      userId: entry.userId,
      amount: entry.amount,
      category: entry.category,
      timestamp: new Date(entry.timestamp),
      riskScore: Math.floor(fraudResult.riskScore),
      isFlagged: fraudResult.isFlagged,
      reasons: fraudResult.reasons.join(", "),
    },
  });

  return transaction;
}

/**
 * Return all transactions ordered by most recent
 */
export async function getAllTransactions(userId: string) {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: {
      timestamp: "desc",
    },
  });
}

/**
 * Reverse a transaction logically (creates a reversal record)
 */
export async function reverseTransaction(transactionId: string) {
  const original = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!original) throw new Error("Transaction not found");

  const alreadyReversed = await prisma.transaction.findFirst({
    where: { parentId: transactionId },
  });
  if (alreadyReversed) throw new Error("Transaction already reversed");

  const age = Date.now() - new Date(original.timestamp).getTime();
  const maxDays = 30 * 24 * 60 * 60 * 1000;
  if (age > maxDays) throw new Error("Transaction too old to reverse");

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

  return await prisma.transaction.create({ data: reversed });
}
