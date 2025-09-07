import * as crypto from 'crypto';
import {
  LedgerEntry,
  LedgerEntryInput,
  Transaction,
  TransactionInput
} from '@ledgerX/types';

/**
 * Generates a cryptographic hash for a ledger entry input.
 */
export function generateHash(entry: LedgerEntryInput): string {
  const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Basic risk score calculation (AI functions will be called from backend)
 */
function calculateBasicRiskScore(entry: LedgerEntry): {
  score: number;
  isSuspicious: boolean;
} {
  let score = 0;
  
  // Basic rule-based scoring
  if (entry.amount > 50000) score += 40;
  if (entry.isReversal) score += 10;
  
  const hour = new Date(entry.timestamp).getHours();
  if (hour < 6 || hour > 22) score += 20;

  return {
    score,
    isSuspicious: score >= 60
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

  const classifiedCategory = category ?? 'general';
  const hash = generateHash(input);

  const baseEntry: LedgerEntry = {
    ...entry,
    timestamp,
    hash,
    category: classifiedCategory
  };

  const { score, isSuspicious } = calculateBasicRiskScore(baseEntry);

  return {
    ...baseEntry,
    riskScore: score,
    isSuspicious
  };
}

/**
 * Creates a full double-entry transaction (debit & credit) with basic scoring.
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
