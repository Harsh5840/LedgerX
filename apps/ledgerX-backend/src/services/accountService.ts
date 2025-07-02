import { prisma } from "@ledgerX/db";
import { Account, AccountType } from "@ledgerX/db";
import { z } from "zod";

// Zod schemas defined inline
const accountTypeEnum = z.nativeEnum(AccountType );

const createAccountSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1, "Account name cannot be empty"),
  type: accountTypeEnum,
});

const updateAccountNameSchema = z.object({
  accountId: z.string().uuid(),
  newName: z.string().min(1, "New name cannot be empty"),
});

/**
 * Create a new account for a user
 */
export async function createAccount(
  userId: string,
  name: string,
  type: AccountType
): Promise<Account> {
  const parsed = createAccountSchema.parse({ userId, name, type });

  return prisma.account.create({
    data: parsed,
  });
}

/**
 * Get all accounts of a user (optionally includes entries)
 */
export async function getUserAccounts(userId: string): Promise<Account[]> {
  if (!z.string().uuid().safeParse(userId).success) {
    throw new Error("Invalid userId");
  }

  return prisma.account.findMany({
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
  if (!z.string().uuid().safeParse(accountId).success) {
    throw new Error("Invalid accountId");
  }

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
  if (!z.string().uuid().safeParse(accountId).success) {
    throw new Error("Invalid accountId");
  }

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
  const parsed = updateAccountNameSchema.parse({ accountId, newName });

  return prisma.account.update({
    where: { id: parsed.accountId },
    data: { name: parsed.newName },
  });
}
