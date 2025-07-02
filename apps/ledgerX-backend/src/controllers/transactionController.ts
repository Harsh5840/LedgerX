import { Request, Response } from 'express';
import { createTransaction as buildLedgerTxn } from '@ledgerx/core';
import {
  createTransaction as persistEntry,
  getAllTransactions,
  reverseTransaction,
} from '../services/transactionService';
import { classifyCategory } from '@ledgerx/ai/src/ml';

/**
 * Create a new transaction with linked debit/credit entries.
 */
export const handleCreateTransaction = async (req: Request, res: Response) => {
  try {
    const input = req.body;

    // Use AI to classify categories for debit and credit
    const timestamp = new Date().toISOString();
    const debitCategory = await classifyCategory({ data: `${input.from} ${input.description}`, timestamp });
    const creditCategory = await classifyCategory({ data: `${input.to} ${input.description}`, timestamp });

    // Build the transaction using the LedgerX core logic
    const tx = await buildLedgerTxn({
      ...input,
      debitCategory,
      creditCategory,
    });

    // Save entries to the database
    await persistEntry(tx.debit);
    await persistEntry(tx.credit);

    return res.status(201).json({ message: 'Transaction added successfully', tx });
  } catch (error) {
    console.error('Transaction creation failed:', error);
    return res.status(500).json({ error: 'Failed to add transaction' });
  }
};

/**
 * Fetch all transactions for a specific user (from JWT middleware).
 */
export const handleGetAllTransactions = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user!;

    const transactions = await getAllTransactions(userId);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user' });
    }

    return res.json(transactions);
  } catch (error) {
    console.error('Transaction fetch failed:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Reverse a transaction by transaction ID (admin access only).
 */
export const handleReverseTransaction = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    const reversal = await reverseTransaction(transactionId as string);

    return res.status(201).json({ message: 'Transaction reversed', reversal });
  } catch (error) {
    console.error('Transaction reversal failed:', error);
    return res.status(400).json({ error: (error as Error).message });
  }
};
