import { createEntry } from './ledger';
import { Transaction } from './types';

/**
 * Creates a reversal of a given transaction by inverting the debit/credit.
 * Marks them as reversals and cryptographically links via prevHash + originalHash.
 */
export async function reverseTransaction(original: Transaction): Promise<Transaction> {
  const { debit, credit } = original;

  const timestamp = new Date().toISOString();

  // Step 1: Create a credit entry to reverse the original debit
  const reversedDebit = await createEntry(
    {
      userId: debit.userId,
      account: debit.account,
      type: 'credit', // reverse of 'debit'
      amount: debit.amount,
      isReversal: true,
      originalHash: debit.hash,
      prevHash: credit.hash, // Chain from original transaction
    },
    timestamp,
    debit.category as string
  );

  // Step 2: Create a debit entry to reverse the original credit
  const reversedCredit = await createEntry(
    {
      userId: credit.userId,
      account: credit.account,
      type: 'debit', // reverse of 'credit'
      amount: credit.amount,
      isReversal: true,
      originalHash: credit.hash,
      prevHash: reversedDebit.hash, // Chain forward from reversedDebit
    },
    timestamp,
    credit.category as string
  );

  return {
    debit: reversedDebit,
    credit: reversedCredit,
  };
}
