/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `LedgerEntry` will be added. If there are existing duplicate values, this will fail.
  - Made the column `category` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_transactionId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'others',
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "isFlagged" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_hash_key" ON "LedgerEntry"("hash");

-- CreateIndex
CREATE INDEX "LedgerEntry_hash_idx" ON "LedgerEntry"("hash");

-- CreateIndex
CREATE INDEX "LedgerEntry_originalHash_idx" ON "LedgerEntry"("originalHash");

-- CreateIndex
CREATE INDEX "LedgerEntry_prevHash_idx" ON "LedgerEntry"("prevHash");

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
