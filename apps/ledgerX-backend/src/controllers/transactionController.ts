import { Request, Response } from 'express';
import { createTransaction as buildLedgerTxn } from '@ledgerX/core';
import { classifyCategory } from '@ledgerX/ai/src/ml';
import { prisma } from '@ledgerX/db';

import {
  createTransaction,
  reverseTransaction,
  getAllTransactions,
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

    const created = await createTransaction(tx);

    return res.status(201).json({ message: 'Transaction added successfully', transaction: created });
  } catch (error) {
    console.error('Transaction creation failed:', error);
    return res.status(500).json({ error: 'Failed to add transaction' });
  }
};

export const handleGetAllTransactions = async (req: Request, res: Response) => {
  try {
    const { id: userId, role } = req.user!;
    
    let transactions: any[];
    
    if (role === 'ADMIN') {
      transactions = await prisma.transaction.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });
    } else {
      transactions = await getAllTransactions(userId);
    }

    if (!transactions || transactions.length === 0) {
      return res.json([]);
    }

    const enhancedTransactions = transactions.map((tx: any) => ({
      id: tx.id,
      description: tx.description || 'No description',
      amount: tx.amount,
      category: tx.category,
      timestamp: tx.timestamp.toISOString(),
      date: tx.timestamp.toISOString().split('T')[0],
      riskScore: tx.riskScore || Math.floor(Math.random() * 100),
      status: 'completed',
      canReverse: tx.amount < 0 && !tx.parentId,
      hash: `tx_${tx.id.slice(0, 8)}`,
      user: role === 'ADMIN' ? {
        id: tx.user?.id || tx.userId,
        name: tx.user?.name || 'Unknown User',
        email: tx.user?.email || 'unknown@example.com'
      } : undefined
    }));

    return res.json(enhancedTransactions);
  } catch (error) {
    console.error('Transaction fetch failed:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

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
