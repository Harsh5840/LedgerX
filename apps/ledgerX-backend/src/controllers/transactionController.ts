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

    // Classify categories using AI with proper LedgerEntryInput
    const debitCategory = await classifyCategory({ data: `${input.from} ${input.description}`, timestamp: new Date().toISOString() });
    const creditCategory = await classifyCategory({
      data: `${input.to} ${input.description}`, timestamp: new Date().toISOString()
    });

    // Build ledger transaction
    const tx = await buildLedgerTxn({
      ...input,
      debitCategory,
      creditCategory,
    });

    // Persist debit and credit entries
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
