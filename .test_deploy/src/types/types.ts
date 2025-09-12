// apps/backend/src/types/types.ts

export interface LedgerEntryInput {
  id: string;
  accountId: string;
  userId: string;
  type: "debit" | "credit";
  amount: number;
  timestamp: Date;
  hash: string;
  prevHash?: string | null;
  originalHash?: string | null;
  isReversal: boolean;
  category?: string | null;
  flagged: boolean;
  riskScore?: number | null;
  description?: string | null;
  transactionId: string;
}

