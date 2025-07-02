import * as crypto from 'crypto';
import { LedgerEntry, LedgerEntryInput, Transaction, TransactionInput } from './types';
import { classifyCategory } from '@ledgerX/ai';
import { ruleBasedScore } from '@ledgerX/ai';
import { mlRiskScore } from '@ledgerX/ai';
import { isolationForestScore } from '@ledgerX/ai';

export function generateHash(entry: LedgerEntryInput): string {
  const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function calculateRiskScore(entry: LedgerEntry): Promise<{ score: number; isSuspicious: boolean }> {
  const [ruleScore, mlScore, isoScore] = await Promise.all([
    ruleBasedScore(entry),
    mlRiskScore(entry),
    isolationForestScore(entry)
  ]);

  const totalScore = ruleScore + mlScore + isoScore;
  return {
    score: totalScore,
    isSuspicious: totalScore >= 60,
  };
}

export async function createEntry(
  entry: Omit<LedgerEntry, 'hash' | 'timestamp' | 'category' | 'riskScore' | 'isSuspicious'>,
  timestamp: string,
  category?: string
): Promise<LedgerEntry> {
  const input: LedgerEntryInput = {
    data: entry.account,
    timestamp,
    prevHash: entry.prevHash,
  };

  const classifiedCategory = category ?? (await classifyCategory(input));
  const hash = generateHash(input);

  const baseEntry: LedgerEntry = {
    ...entry,
    timestamp,
    hash,
    category: classifiedCategory,
  };

  const { score, isSuspicious } = await calculateRiskScore(baseEntry);

  return {
    ...baseEntry,
    riskScore: score,
    isSuspicious,
  };
}

/**
 * Creates a debit-credit transaction with classification + scoring.
 */
export async function createTransaction(
  input: TransactionInput & { debitCategory?: string; creditCategory?: string }
): Promise<Transaction> {
  const { userId, from, to, amount, prevHash, debitCategory, creditCategory } = input;
  const timestamp = new Date().toISOString();

  const debit = await createEntry(
    {
      account: from,
      userId,
      type: 'debit',
      amount,
      prevHash,
      isReversal: false,
    },
    timestamp,
    debitCategory
  );

  const credit = await createEntry(
    {
      account: to,
      userId,
      type: 'credit',
      amount,
      prevHash: debit.hash,
      isReversal: false,
    },
    timestamp,
    creditCategory
  );

  return { debit, credit };
}
