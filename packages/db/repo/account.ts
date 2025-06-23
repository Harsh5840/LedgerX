// packages/db/repo/account.ts

import { prisma } from "../src/client";
import type { AccountType } from "../src/types";

type Account = {
  id: string;
  name: string;
  type: AccountType;
  userId: string;
  createdAt?: Date;
  entries?: any[];
  user?: any;
};

export async function createAccount(userId: string, name: string, type: AccountType): Promise<Account> {
  return prisma.account.create({ data: { name, type, userId } });
}

export async function getUserAccounts(userId: string): Promise<Account[]> {
  return prisma.account.findMany({ where: { userId }, include: { entries: true } });
}

export async function getAccountById(accountId: string): Promise<Account | null> {
  return prisma.account.findUnique({ where: { id: accountId }, include: { user: true, entries: true } });
}

export async function deleteAccount(accountId: string): Promise<Account> {
  return prisma.account.delete({ where: { id: accountId } });
}

export async function updateAccountName(accountId: string, newName: string): Promise<Account> {
  return prisma.account.update({ where: { id: accountId }, data: { name: newName } });
}
