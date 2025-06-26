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



export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  timestamp: string;
  riskScore: number;
  isFlagged: boolean;
  reasons?: string;
  parentId?: string;
  createdAt: string;
}

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