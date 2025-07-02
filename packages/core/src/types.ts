export interface LedgerEntryInput {
  data: any;
  timestamp: string;
  prevHash?: string;
}

export interface LedgerEntry {
  account: string;
  userId: string;
  type: 'debit' | 'credit';
  amount: number;
  hash: string;
  timestamp: string;
  prevHash: string;
  isReversal?: boolean;
  originalHash?: string;
  category?: string;

  // NEW FIELDS
  riskScore?: number;        // ML + rule-based score
  isSuspicious?: boolean;    // Result from Isolation Forest or scoring threshold
}

export interface TransactionInput {
  userId: string;
  from: string;
  to: string;
  amount: number;
  prevHash: string;
}

export interface Transaction {
  debit: LedgerEntry;
  credit: LedgerEntry;
}

export interface ChainEntry {
  hash: string;
  prevHash: string;
  timestamp: string;
}
