import { Request, Response } from 'express';
import { createTransaction } from '@ledgerX/core';
import { addTransaction, getAllTransactions } from '@ledgerX/db';

/**
 * Create a new transaction with linked debit/credit entries.
 */
export const handleCreateTransaction = async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const tx = await createTransaction(input);
    await addTransaction(tx);
    res.status(201).json({ message: 'Transaction added successfully', tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

/**
 * Fetch all transactions for a specific user.
 */
export const handleGetAllTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const transactions = await getAllTransactions(userId as string);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
