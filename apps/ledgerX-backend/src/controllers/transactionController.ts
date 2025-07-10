import { Request, Response } from 'express';
import { createTransaction as buildLedgerTxn } from '@ledgerx/core';
import { classifyCategory } from '@ledgerx/ai/src/ml';

import {
  createTransaction, // ⬅️ PATCHED: new import from shared DB repo
  reverseTransaction,
  getAllTransactions, // ✅ Keep if this is still local in services
} from '../services/transactionService';

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

    // ✅ NEW: Persist using shared database repo
    const created = await createTransaction(tx);

    return res.status(201).json({ message: 'Transaction added successfully', transaction: created });
  } catch (error) {
    console.error('Transaction creation failed:', error);
    return res.status(500).json({ error: 'Failed to add transaction' });
  }
};

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

export const handleReverseTransaction = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    const reversal = await reverseTransaction(transactionId as string); // ✅ shared DB fn

    return res.status(201).json({ message: 'Transaction reversed', reversal });
  } catch (error) {
    console.error('Transaction reversal failed:', error);
    return res.status(400).json({ error: (error as Error).message });
  }
};
