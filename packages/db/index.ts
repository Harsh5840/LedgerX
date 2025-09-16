// Re-export Prisma client singleton
export * from './src/client';

// Optional: export your own domain-specific types or enums
export * from './src/types';

// Re-export Prisma-generated types and enums
export * from '@prisma/client';

// Grouped and namespaced exports from repositories
export * as LedgerRepo from './src/ledger';
export * as TransactionRepo from './src/transaction';
export * as AccountRepo from './src/account';
export { addTransaction } from './src/ledger';
export * from './src/account';
export * from './src/transaction';

export { prisma } from './src/client';