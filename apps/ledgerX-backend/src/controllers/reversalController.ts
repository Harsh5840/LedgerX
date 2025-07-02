

import { Request, Response } from 'express';
import { prisma, TransactionRepo } from '@ledgerX/db';
import { createTransaction } from '@ledgerX/core';

export const handleReversal = async (req: Request, res: Response) => {
  try {
    const { originalHash } = req.params;

    const entries = await prisma.ledgerEntry.findMany({
      where: { hash: originalHash }
    });

    if (entries.length === 0) {
      return res.status(404).json({ error: 'Original transaction not found' });
    }

    const original = entries[0]; // Not destructured

if (!original) {
  return res.status(404).json({ error: 'Original transaction not found' });
}

    const isCredit = original.type === 'credit';
    const isDebit = original.type === 'debit';

    const reversed = await createTransaction({
      userId: original.userId,
      from: isCredit ? original.accountId : '',
      to: isDebit ? original.accountId : '',
      amount: original.amount,
      prevHash: original.hash,
      debitCategory: original.category ?? undefined,
      creditCategory: original.category ?? undefined,
    });

    // Add reversal metadata
    reversed.debit.isReversal = true;
    reversed.debit.originalHash = original.hash;
    reversed.credit.isReversal = true;
    reversed.credit.originalHash = original.hash;

    // Optional: propagate riskScore/flags if needed
    reversed.debit.riskScore = 0;
    reversed.credit.riskScore = 0;
    reversed.debit.isSuspicious = false;
    reversed.credit.isSuspicious = false;

    // Store in DB
    const tx = await TransactionRepo.addTransactionFromCore({
      ...reversed,
      reasons: 'Reversal',
      parentId: original.transactionId,
    });

    return res.status(200).json({
      message: 'Transaction reversed successfully',
      reversed: tx,
    });
  } catch (error) {
    console.error('Reversal Error:', error);
    return res.status(500).json({ error: 'Failed to reverse transaction' });
  }
};
