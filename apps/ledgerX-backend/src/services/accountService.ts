import { prisma } from "@ledgerX/db";
import type { Account, AccountType } from "@ledgerX/db";  
 
export async function createAccount(  
  userId: string,
  name: string,
  type: AccountType
): Promise<Account> {
  return await prisma.account.create({
    data: {
      name,
      type,
      userId,
    },
  });
}

/**
 * Get all accounts of a user (optionally includes entries)
 */
export async function getUserAccounts(userId: string): Promise<Account[]> {
  return await prisma.account.findMany({
    where: { userId },
    include: {
      entries: true,
    },
  });
}

/**
 * Get a specific account by its ID (with user + entries)
 */
export async function getAccountById(accountId: string): Promise<Account | null> {
  return await prisma.account.findUnique({
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
  return await prisma.account.delete({
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
  return await prisma.account.update({
    where: { id: accountId },
    data: { name: newName },
  });
}
