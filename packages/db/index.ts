// Re-export Prisma client singleton
export * from './dist/client';

// Optional: export your own domain-specific types or enums
export * from './dist/types';

// Re-export Prisma-generated types and enums
export * from '@prisma/client';

// Grouped and namespaced exports from repositories
export * as LedgerRepo from './repo/ledger';
export * as TransactionRepo from './repo/transaction';
export * as AccountRepo from './repo/account'; // if you have account logic
export {addTransaction} from './repo/ledger'; // if you have a specific function to export

