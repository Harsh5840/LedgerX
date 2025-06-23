import { prisma } from "@ledgerx/db";
import { AccountType } from "@prisma/client";

export async function createAccount(
  userId: string,
  name: string,
  type: AccountType
) {
  return prisma.account.create({
    data: {
      userId,
      name,
      type,
    },
  });
}

export async function getAccountsByUser(userId: string) {
  return prisma.account.findMany({
    where: { userId },
  });
}

export async function deleteAccountById(id: string) {
  return prisma.account.delete({
    where: { id },
  });
}
