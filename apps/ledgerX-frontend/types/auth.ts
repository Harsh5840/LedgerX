export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'AUDITOR';
  image?: string;
}

export interface Transaction {
  id: string;
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
}

export interface Analytics {
  totalSpendThisMonth: number;
  income: number;
  expense: number;
  topCategories: Array<{ name: string; value: number; }>;
  monthlyTrend: Array<{ month: string; income: number; expense: number; }>;
  flaggedTransactions: number;
}

export interface RiskAssessment {
  id: string;
  transactionId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: string[];
  timestamp: string;
}