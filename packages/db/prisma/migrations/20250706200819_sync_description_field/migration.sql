/*
  Warnings:

  - Added the required column `transactionId` to the `LedgerEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LedgerEntry" ADD COLUMN     "description" TEXT,
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "description" TEXT,
ALTER COLUMN "riskScore" DROP NOT NULL,
ALTER COLUMN "riskScore" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_category_idx" ON "LedgerEntry"("userId", "category");

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_timestamp_idx" ON "LedgerEntry"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "LedgerEntry_riskScore_flagged_idx" ON "LedgerEntry"("riskScore", "flagged");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
