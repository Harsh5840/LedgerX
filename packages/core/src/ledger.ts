import * as crypto from 'crypto';
import { LedgerEntry, LedgerEntryInput, Transaction, TransactionInput } from './types';
import { classifyCategory } from '@ledgerX/ai/src/ml';

    
export function generateHash(entry: LedgerEntryInput): string {
  const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}


export async function createEntry(
  entry: Omit<LedgerEntry, 'hash' | 'timestamp' | 'category'>,
  timestamp: string
): Promise<LedgerEntry> {
  const input: LedgerEntryInput = {
    data: entry.account,  // assuming 'account' is the best field to describe the entry
    timestamp,
    prevHash: entry.prevHash,
  };

  const hash = generateHash(input);

  const category = await classifyCategory(input);

  return {
    ...entry,
    timestamp,
    hash,
    category,
  };
}

/**
 * Creates a debit-credit transaction with linked hashes and category classification.
 */
export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  const { userId, from, to, amount, prevHash } = input;
  const timestamp = new Date().toISOString();

  const debit = await createEntry(
    {
      account: from,
      userId,
      type: 'debit',
      amount,
      prevHash,
    },
    timestamp
  );

  const credit = await createEntry(
    {
      account: to,
      userId,
      type: 'credit',
      amount,
      prevHash: debit.hash,
    },
    timestamp
  );

  return { debit, credit };
}
