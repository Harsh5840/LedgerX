import { Account, AccountType } from "@ledgerX/db";
import {
  createAccount as rawCreateAccount,
  getUserAccounts as rawGetUserAccounts,
  getAccountById as rawGetAccountById,
  deleteAccount as rawDeleteAccount,
  updateAccountName as rawUpdateAccountName,
} from "@ledgerX/db/src/account";

import { z } from "zod";

// Zod schemas
const accountTypeEnum = z.nativeEnum(AccountType);

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
  return rawCreateAccount(parsed.userId, parsed.name, parsed.type);
}

/**
 * Get all accounts of a user (includes ledger entries)
 */
export async function getUserAccounts(userId: string): Promise<Account[]> {
  if (!z.string().uuid().safeParse(userId).success) {
    throw new Error("Invalid userId");
  }

  return rawGetUserAccounts(userId);
}

/**
 * Get a specific account by ID (includes user + entries)
 */
export async function getAccountById(accountId: string): Promise<Account | null> {
  if (!z.string().uuid().safeParse(accountId).success) {
    throw new Error("Invalid accountId");
  }

  return rawGetAccountById(accountId);
}

/**
 * Delete an account by ID
 */
export async function deleteAccount(accountId: string): Promise<Account> {
  if (!z.string().uuid().safeParse(accountId).success) {
    throw new Error("Invalid accountId");
  }

  return rawDeleteAccount(accountId);
}

/**
 * Update account name
 */
export async function updateAccountName(
  accountId: string,
  newName: string
): Promise<Account> {
  const parsed = updateAccountNameSchema.parse({ accountId, newName });
  return rawUpdateAccountName(parsed.accountId, parsed.newName);
}
