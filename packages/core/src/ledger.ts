import * as crypto from 'crypto';
import {
  LedgerEntry,
  LedgerEntryInput,
  Transaction,
  TransactionInput
} from './types';

import {
  classifyCategory,
  ruleBasedScore,
  mlRiskScore,
  isolationForestScore
} from '@ledgerX/ai';

/**
 * Generates a cryptographic hash for a ledger entry input.
 */
export function generateHash(entry: LedgerEntryInput): string {
  const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Calculates combined risk score using rule-based, ML, and isolation forest approaches.
 */
async function calculateRiskScore(entry: LedgerEntry): Promise<{
  score: number;
  isSuspicious: boolean;
}> {
  const [ruleScore, mlScore, isoScore] = await Promise.all([
    ruleBasedScore(entry),
    mlRiskScore(entry),
    isolationForestScore(entry)
  ]);

  const totalScore = ruleScore + mlScore + isoScore;
  return {
    score: totalScore,
    isSuspicious: totalScore >= 60
  };
}

/**
 * Creates a single ledger entry with hash, category classification, and risk scoring.
 */
export async function createEntry(
  entry: Omit<
    LedgerEntry,
    'hash' | 'timestamp' | 'category' | 'riskScore' | 'isSuspicious'
  >,
  timestamp: string,
  category?: string
): Promise<LedgerEntry> {
  const input: LedgerEntryInput = {
    data: entry.account,
    timestamp,
    prevHash: entry.prevHash
  };

  const classifiedCategory = category ?? (await classifyCategory(input));
  const hash = generateHash(input);

  const baseEntry: LedgerEntry = {
    ...entry,
    timestamp,
    hash,
    category: classifiedCategory
  };

  const { score, isSuspicious } = await calculateRiskScore(baseEntry);

  return {
    ...baseEntry,
    riskScore: score,
    isSuspicious
  };
}

/**
 * Creates a full double-entry transaction (debit & credit) with classification + scoring.
 */
export async function createTransaction(
  input: TransactionInput & {
    debitCategory?: string;
    creditCategory?: string;
  }
): Promise<Transaction> {
  const { userId, from, to, amount, prevHash, debitCategory, creditCategory } =
    input;

  const timestamp = new Date().toISOString();

  const debit = await createEntry(
    {
      account: from,
      userId,
      type: 'debit',
      amount,
      prevHash,
      isReversal: false
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
      isReversal: false
    },
    timestamp,
    creditCategory
  );

  return { debit, credit };
}
