import { createEntry } from './ledger';
import { Transaction } from './types';

export function reverseTransaction(original: Transaction): Transaction {
  const { debit, credit } = original;

  const reversedDebit = createEntry({
    userId: debit.userId,
    account: debit.account,
    type: 'credit',
    amount: debit.amount,
    isReversal: true,
    originalHash: debit.hash,
    prevHash: credit.hash
  }, new Date().toISOString());

  const reversedCredit = createEntry({
    userId: credit.userId,
    account: credit.account,
    type: 'debit',
    amount: credit.amount,
    isReversal: true,
    originalHash: credit.hash,
    prevHash: reversedDebit.hash
  }, new Date().toISOString());

  return {
    debit: reversedDebit,
    credit: reversedCredit,
  };
}
