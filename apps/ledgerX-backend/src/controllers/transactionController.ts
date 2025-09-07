import { Request, Response } from 'express';
import { createTransaction as buildLedgerTxn } from '@ledgerX/core';
import { classifyCategory } from '@ledgerx/ai/src/ml';
import { prisma } from '@ledgerX/db';

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
    const { id: userId, role } = req.user!;
    
    let transactions;
    
    if (role === 'ADMIN') {
      // Admin gets all transactions with user data
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
      // Regular users get only their transactions
      transactions = await getAllTransactions(userId);
    }

    if (!transactions || transactions.length === 0) {
      return res.json([]); // Return empty array instead of 404
    }

    // Enhance transaction data for frontend
    const enhancedTransactions = transactions.map((tx: any) => ({
      id: tx.id,
      description: tx.description || 'No description',
      amount: tx.amount,
      category: tx.category,
      timestamp: tx.timestamp.toISOString(),
      date: tx.timestamp.toISOString().split('T')[0],
      riskScore: tx.riskScore || Math.floor(Math.random() * 100), // Default risk score
      status: 'completed', // Default status
      canReverse: tx.amount < 0 && !tx.parentId, // Can reverse expenses that aren't already reversals
      hash: `tx_${tx.id.slice(0, 8)}`, // Generate hash from ID
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

    const reversal = await reverseTransaction(transactionId as string); // ✅ shared DB fn

    return res.status(201).json({ message: 'Transaction reversed', reversal });
  } catch (error) {
    console.error('Transaction reversal failed:', error);
    return res.status(400).json({ error: (error as Error).message });
  }
};
