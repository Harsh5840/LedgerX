// packages/db/repo/transaction.ts

import { prisma } from "../src/client";
import { EntryType, Prisma } from "@prisma/client";
import { Transaction as LedgerXTransaction } from "@ledgerX/core"; // Use core-defined type

/**
 * Maps a LedgerX ledger entry to Prisma-compatible LedgerEntryCreateWithoutTransactionInput
 */
function mapLedgerEntry(entry: LedgerXTransaction["debit"] | LedgerXTransaction["credit"]): Prisma.LedgerEntryCreateWithoutTransactionInput {
  return {
    account: {
      connect: { id: entry.account },
    },
    user: {
      connect: { id: entry.userId },
    },
    type: entry.type,
    amount: entry.amount,
    timestamp: new Date(entry.timestamp),
    hash: entry.hash,
    prevHash: entry.prevHash,
    isReversal: entry.isReversal ?? false,
    originalHash: entry.originalHash ?? null,
    category: entry.category,
    flagged: entry.isSuspicious ?? false,
    riskScore: entry.riskScore,
  };
}

/**
 * Adds a transaction from core to the database with ledger entries
 */
export async function addTransactionFromCore(transaction: LedgerXTransaction & {
  reasons?: string;
  parentId?: string | null;
}) {
  const { debit, credit } = transaction;

  return prisma.transaction.create({
    data: {
      user: {
        connect: { id: debit.userId },
      },
      amount: debit.amount,
      category: debit.category,
      timestamp: new Date(debit.timestamp),
      riskScore: debit.riskScore,
      isFlagged: debit.isSuspicious ?? false,
      reasons: transaction.reasons ?? '',
      parentId: transaction.parentId ?? undefined,
      ledgerEntries: {
        create: [
          mapLedgerEntry(debit),
          mapLedgerEntry(credit),
        ],
      },
    },
  });
}

/**
 * Reverses a transaction by creating a new transaction and inverse ledger entries
 */
export async function reverseTransaction(transactionId: string) {
  const original = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { ledgerEntries: true },
  });

  if (!original) throw new Error("Transaction not found");

  const reversedTx = await prisma.transaction.create({
    data: {
      user: { connect: { id: original.userId } },
      amount: -original.amount,
      category: original.category,
      timestamp: new Date(),
      riskScore: 0,
      isFlagged: false,
      reasons: "Reversal",
      parentId: original.id,
    },
  });

  const reversedEntries = original.ledgerEntries.map(entry => ({
    account: { connect: { id: entry.accountId } },
    user: { connect: { id: entry.userId } },
    type: entry.type === EntryType.debit ? EntryType.credit : EntryType.debit,
    amount: entry.amount,
    timestamp: new Date(),
    hash: `REVERSED-${entry.hash}`, // Optional: you can hash it properly
    prevHash: entry.hash,
    isReversal: true,
    originalHash: entry.hash,
    category: entry.category,
    flagged: false,
    riskScore: 0,
    transaction: { connect: { id: reversedTx.id } },
  }));

  await prisma.$transaction(
    reversedEntries.map(data => prisma.ledgerEntry.create({ data }))
  );

  return reversedTx;
}
