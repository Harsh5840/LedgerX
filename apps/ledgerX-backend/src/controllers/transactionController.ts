import { Request, Response } from 'express';
import { createTransaction as buildLedgerTxn } from '@ledgerx/core';
import {
  createTransaction as persistEntry,
  getAllTransactions,
  reverseTransaction,
} from '../services/transactionService';
import { classifyCategory } from '@ledgerx/ai/src/ml';

export const handleCreateTransaction = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user!;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    const input = req.body;
    const { description, type } = input;

    if (!["expense", "income", "transfer"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    const timestamp = new Date().toISOString();

    let debitCategory = "others";
    let creditCategory = "others";

    if (type === "expense") {
      debitCategory = await classifyCategory({ data: description, timestamp });
    } else if (type === "income") {
      creditCategory = await classifyCategory({ data: description, timestamp });
    } else if (type === "transfer") {
      debitCategory = "transfer";
      creditCategory = "transfer";
    }

    const tx = await buildLedgerTxn({
      ...input,
      userId,
      timestamp,
      debitCategory,
      creditCategory,
    });

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
