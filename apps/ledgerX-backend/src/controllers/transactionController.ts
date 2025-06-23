import { Request, Response } from 'express';
import { createTransaction } from '@ledgerX/core';
import { addTransaction, getAllTransactions, getTopCategories, getTotalSpending } from '@ledgerX/db';

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

export const handleGetAllTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;  //params me aur bhi data ayega isliye we just picked userId 
    const transactions = await getAllTransactions(userId as string);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const handleTopCategories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    const top = await getTopCategories(userId as string, parseInt(limit as string) || 5);
    res.json(top);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top categories' });
  }
};

export const handleTotalSpending = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;   //req.params is used to get the parameters from the url
    const { category, month } = req.query;  //req.query is used to get the query parameters from the url
    const total = await getTotalSpending(userId as string, {
      category: category as string,
      month: month ? parseInt(month as string) : undefined,
    });
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total spending' });
  }
}; 
