export const TRANSACTION_CATEGORIES = [
  'Income',
  'Expense',
  'Transfer',
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health & Fitness',
  'Travel',
  'Education',
  'Investments',
  'Other',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export interface Transaction {
  id: string;
  userId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  category: string;
  description: string;
  timestamp: string;
  hash: string;
  previousHash?: string;
  reversed?: boolean;
  reversedBy?: string;
  reversedAt?: string;
  riskScore?: number;
  isFlagged?: boolean;
  reasons?: string;
}

export interface CreateTransactionInput {
  from: string;
  to: string;
  amount: number;
  description: string;
  category?: string;
}

export interface TransactionResponse {
  message?: string;
  transaction?: Transaction;
  error?: string;
}