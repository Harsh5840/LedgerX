import { prisma } from "./client";
import { Account, AccountType } from "@prisma/client";

/**
 * Create a new account for a user
 */
export async function createAccount(
  userId: string,
  name: string,
  type: AccountType
): Promise<Account> {
  return prisma.account.create({
    data: { name, type, userId },
  });
}

/**
 * Get all accounts of a user (with ledger entries)
 */
export async function getUserAccounts(userId: string): Promise<Account[]> {
  return prisma.account.findMany({
    where: { userId },
    include: {
      entries: true, // Related LedgerEntries
    },
  });
}

/**
 * Get a specific account by ID (with entries + user)
 */
export async function getAccountById(accountId: string): Promise<Account | null> {
  return prisma.account.findUnique({
    where: { id: accountId },
    include: {
      user: true,
      entries: true,
    },
  });
}

/**
 * Delete an account by ID
 */
export async function deleteAccount(accountId: string): Promise<Account> {
  return prisma.account.delete({
    where: { id: accountId },
  });
}

/**
 * Update account name
 */
export async function updateAccountName(
  accountId: string,
  newName: string
): Promise<Account> {
  return prisma.account.update({
    where: { id: accountId },
    data: { name: newName },
  });
}