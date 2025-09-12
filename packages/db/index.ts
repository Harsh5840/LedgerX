// Re-export Prisma client singleton
export * from './src/client';

// Optional: export your own domain-specific types or enums
export * from './src/types';

// Re-export Prisma-generated types and enums
export * from '@prisma/client';

// Grouped and namespaced exports from repositories
export * as LedgerRepo from './repo/ledger';
export * as TransactionRepo from './repo/transaction';
export * as AccountRepo from './repo/account';
export { addTransaction } from './repo/ledger';

