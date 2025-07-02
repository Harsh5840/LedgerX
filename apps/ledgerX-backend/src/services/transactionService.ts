import { prisma } from "@ledgerx/db";
import { LedgerEntry } from "@ledgerx/core";
import { analyzeFraud } from "./fraudService";

const MAX_REVERSAL_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Create a transaction and persist to DB with fraud analysis
 */
export async function createTransaction(entry: LedgerEntry) {
  try {
    const fraudResult = await analyzeFraud(entry);

    const transaction = await prisma.transaction.create({
      data: {
        userId: entry.userId,
        amount: entry.amount,
        category: entry.category,
        timestamp: new Date(entry.timestamp),
        riskScore: Math.floor(fraudResult.riskScore),
        isFlagged: fraudResult.isFlagged,
        reasons: JSON.stringify(fraudResult.reasons), // ✅ Store as JSON array
      },
    });

    return transaction;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw error;
  }
}

/**
 * Return all transactions ordered by most recent
 */
export async function getAllTransactions(userId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      include: {
        ledgerEntries: true,
      },
    });

    return transactions.map((txn) => {
      const debit = txn.ledgerEntries.find((e) => e.type === "debit");
      const credit = txn.ledgerEntries.find((e) => e.type === "credit");

      return {
        ...txn,
        debit,
        credit,
        reasons: JSON.parse(txn.reasons ?? "[]"),
      };
    });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
}

/**
 * Reverse a transaction logically (creates a reversal record)
 */
export async function reverseTransaction(transactionId: string) {
  try {
    const original = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!original) throw new Error("Transaction not found");

    const alreadyReversed = await prisma.transaction.findFirst({
      where: { parentId: transactionId },
    });
    if (alreadyReversed) throw new Error("Transaction already reversed");

    const age = Date.now() - new Date(original.timestamp).getTime();
    if (age > MAX_REVERSAL_AGE_MS) throw new Error("Transaction too old to reverse");

    const reversed = {
      userId: original.userId,
      amount: -original.amount,
      category: original.category,
      timestamp: new Date(),
      riskScore: 0,
      isFlagged: false,
      reasons: JSON.stringify(["Reversal"]),
      parentId: original.id,
      isReversal: true, // ✅ Added for audit logging
    };

    return await prisma.transaction.create({ data: reversed });
  } catch (error) {
    console.error("Failed to reverse transaction:", error);
    throw error;
  }
}
