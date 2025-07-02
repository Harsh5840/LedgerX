// packages/db/repo/account.ts

import { prisma } from "../src/client";
import { AccountType } from "@prisma/client"; // Use enum from generated Prisma types

export async function createAccount(userId: string, name: string, type: AccountType) {
  return prisma.account.create({
    data: { name, type, userId },
  });
}

export async function getUserAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    include: { entries: true },
  });
}

export async function getAccountById(accountId: string) {
  return prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true, entries: true },
  });
}

export async function deleteAccount(accountId: string) {
  return prisma.account.delete({ where: { id: accountId } });
}

export async function updateAccountName(accountId: string, newName: string) {
  return prisma.account.update({
    where: { id: accountId },
    data: { name: newName },
  });
}
