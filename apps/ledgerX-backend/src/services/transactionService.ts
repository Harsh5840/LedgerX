import { prisma } from "@ledgerX/db";
import { Transaction as LedgerXTransaction } from "@ledgerX/core";
import {
  addTransactionFromCore,
  reverseTransaction as reverseTxFromDB,
  getAllTransactions as fetchUserTransactions,
} from "@ledgerX/db/repo/transaction";

const MAX_REVERSAL_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Create a full transaction with ledger entries
 */
export async function createTransaction(tx: LedgerXTransaction) {
  return await addTransactionFromCore(tx);
}

/**
 * Fetch all transactions for a user with formatted ledger entries
 */
export async function getAllTransactions(userId: string) {
  const transactions = await fetchUserTransactions(userId);
  return transactions.map((txn: any) => {
    const debit = txn.ledgerEntries.find((e: any) => e.type === "debit");
    const credit = txn.ledgerEntries.find((e: any) => e.type === "credit");

    let reasons: string[] = [];
    const reasonsStr = typeof txn.reasons === 'string' ? txn.reasons : '';
    if (reasonsStr.trim() !== "") {
      try {
        const parsed = JSON.parse(reasonsStr);
        reasons = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        reasons = [reasonsStr];
      }
    }

    return {
      ...txn,
      debit,
      credit,
      reasons,
    };
  });
}

/**
 * Reverse a transaction logically after checking constraints
 */
export async function reverseTransaction(transactionId: string) {
  const original = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { ledgerEntries: true },
  });

  if (!original) throw new Error("Transaction not found");

  const alreadyReversed = await prisma.transaction.findFirst({
    where: { parentId: transactionId },
  });
  if (alreadyReversed) throw new Error("Transaction already reversed");

  const age = Date.now() - new Date(original.timestamp).getTime();
  if (age > MAX_REVERSAL_AGE_MS) throw new Error("Transaction too old to reverse");

  return await reverseTxFromDB(transactionId);
}
