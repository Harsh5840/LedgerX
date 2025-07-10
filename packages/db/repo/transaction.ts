import { prisma } from "../src/client";
import { EntryType, Prisma } from "@prisma/client";
import { Transaction as LedgerXTransaction } from "@ledgerX/core";
import { randomUUID } from "crypto";

function mapLedgerEntry(entry: LedgerXTransaction["debit"] | LedgerXTransaction["credit"]): Prisma.LedgerEntryCreateWithoutTransactionInput {
  return {
    account: { connect: { id: entry.account } },
    user: { connect: { id: entry.userId } },
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

export async function addTransactionFromCore(transaction: LedgerXTransaction & {
  reasons?: string;
  parentId?: string | null;
}) {
  const { debit, credit } = transaction;

  const existing = await prisma.ledgerEntry.findUnique({
    where: { hash: debit.hash },
  });
  if (existing) throw new Error(`Duplicate ledger hash: ${debit.hash}`);

  const txData: Prisma.TransactionCreateInput = {
    user: { connect: { id: debit.userId } },
    amount: debit.amount,
    category: debit.category ?? "others",
    timestamp: new Date(debit.timestamp),
    riskScore: debit.riskScore ?? 0,
    isFlagged: debit.isSuspicious ?? false,
    reasons: transaction.reasons ?? "",
    ledgerEntries: {
      create: [mapLedgerEntry(debit), mapLedgerEntry(credit)],
    },
  };

  if (transaction.parentId) {
    txData.parent = { connect: { id: transaction.parentId } };
  }

  const created = await prisma.transaction.create({ data: txData });

  return prisma.transaction.findUnique({
    where: { id: created.id },
    include: { ledgerEntries: true },
  });
}


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
      parent: { connect: { id: original.id } }, // ✅ Corrected
    },
  });

  const reversedEntries = original.ledgerEntries.map(entry => ({
    account: { connect: { id: entry.accountId } },
    user: { connect: { id: entry.userId } },
    type: entry.type === EntryType.debit ? EntryType.credit : EntryType.debit,
    amount: entry.amount,
    timestamp: new Date(),
    hash: `rev-${entry.hash}-${randomUUID()}`,
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

  return prisma.transaction.findUnique({
    where: { id: reversedTx.id },
    include: { ledgerEntries: true },
  });
}

export async function getAllTransactions(userId: string) {
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

    let reasons: string[] = [];
    if (txn.reasons && txn.reasons.trim() !== "") {
      try {
        const parsed = JSON.parse(txn.reasons);
        reasons = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        reasons = [txn.reasons];
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
