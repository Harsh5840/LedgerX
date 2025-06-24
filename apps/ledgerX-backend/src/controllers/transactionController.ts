import { Request, Response } from 'express';
import { createTransaction as buildLedgerTxn } from '@ledgerx/core';
import { createTransaction as persistEntry, getAllTransactions, reverseTransaction } from '../services/transactionService';

/**
 * Create a new transaction with linked debit/credit entries.
 */
export const handleCreateTransaction = async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const tx = await buildLedgerTxn(input);

    await persistEntry(tx.debit);
    await persistEntry(tx.credit);

    res.status(201).json({ message: 'Transaction added successfully', tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

/**
 * Fetch all transactions for a specific user (from JWT).
 */
export const handleGetAllTransactions = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const transactions = await getAllTransactions(userId);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user' });
    }

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Reverse a transaction (admin only).
 */
export const handleReverseTransaction = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const reversal = await reverseTransaction(transactionId as string);
    res.status(201).json({ message: 'Transaction reversed', reversal });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
};
