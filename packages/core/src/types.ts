export interface LedgerEntryInput {
    data: any;
    timestamp: string;
    prevHash?: string;
};
  
export interface LedgerEntry {
    account: string;  // account name like "Cash" or "Bank" or "Salary" or "Rent" or "Food" or "Entertainment" or "Other"
    userId: string;
    type: 'debit' | 'credit';
    amount: number;
    hash: string;
    timestamp: string;
    prevHash: string;
    isReversal?: boolean;
    originalHash?: string;
    category?: string;
};
  
export interface TransactionInput {
    userId: string;
    from: string;
    to: string;
    amount: number;
    prevHash: string;
};

export interface Transaction {
    debit: LedgerEntry;
    credit: LedgerEntry;
};

export interface ChainEntry {
    hash: string;
    prevHash: string;
    timestamp: string;
}

