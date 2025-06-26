
import { Transaction, LedgerEntry } from "@ledgerx/db";

export const TRANSACTION_CATEGORIES = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'shopping',
  'health',
  'utilities',
  'travel',
  'education',
  'investment',
  'others'
] as const;



export type DualEntryTransaction = Transaction & {
  debit: LedgerEntry;
  credit: LedgerEntry;
};


export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];


export type { Transaction, LedgerEntry };

export interface CreateTransactionInput {
  amount: number;
  category: TransactionCategory;
  fromAccount: string;
  toAccount: string;
  description: string;
}

export interface TransactionResponse {
  message?: string;
  transaction?: Transaction;
  error?: string;
}
