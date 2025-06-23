import { Request, Response } from 'express';
import { LedgerEntry } from '@ledgerX/core/src/types';
import { prisma } from '@ledgerX/db';
import { createTransaction } from '@ledgerX/core';
import { addTransaction } from '@ledgerX/db';

/**
 * Reverse a transaction by original hash.
 */
export const handleReversal = async (req: Request, res: Response) => {
  try {
    const { originalHash } = req.params;

    // Fetch the original debit and credit entries
    const entries = await prisma.ledgerEntry.findMany({
      where: { hash: originalHash },
    });

    if (entries.length === 0) {
      return res.status(404).json({ error: 'Original transaction not found' });
    }

    const [original] = entries;

    const reversalTx = await createTransaction({
      userId: original.userId,
      from: original.type === 'credit' ? original.accountId : '',  // reverse credit
      to: original.type === 'debit' ? original.accountId : '',     // reverse debit
      amount: original.amount,
      prevHash: original.hash,
      isReversal: true,
      originalHash: original.hash,
    });

    // Manually add reversal markers
    const reversed = {
      ...reversalTx,
      debit: { ...reversalTx.debit, isReversal: true, originalHash: original.hash },
      credit: { ...reversalTx.credit, isReversal: true, originalHash: original.hash },
    };

    await addTransaction(reversed);

    res.status(200).json({ message: 'Transaction reversed successfully', reversed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reverse transaction' });
  }
};
