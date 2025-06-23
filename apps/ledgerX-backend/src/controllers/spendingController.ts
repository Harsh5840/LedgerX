import { Request, Response } from 'express';
import {
  getAllTransactions as dbGetAllTransactions,
  getTopCategories as dbGetTopCategories,
  getTotalSpending as dbGetTotalSpending,
} from '@ledgerX/db';
// import { Role } from '@ledgerX/core/src/types';

/**
 * GET /spending/total/:userId?category=&month= 
 */
export async function getTotalSpending(req: Request, res: Response) {
  const { userId } = req.params;
  const { category, month } = req.query;

  try {
    const filters: { category?: string; month?: number } = {};
    if (category && typeof category === 'string') filters.category = category;
    if (month && !isNaN(Number(month))) filters.month = Number(month);

    const total = await dbGetTotalSpending(userId as string, filters);
    res.status(200).json({ total });
  } catch (error) {
    console.error('Error getting total spending:', error);
    res.status(500).json({ error: 'Failed to fetch total spending' });
  }
}

/**
 * GET /spending/top-categories/:userId
 */
export async function getTopCategories(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const topCategories = await dbGetTopCategories(userId as string);
    res.status(200).json({ topCategories });
  } catch (error) {
    console.error('Error getting top categories:', error);
    res.status(500).json({ error: 'Failed to fetch top categories' });
  }
}

/**
 * GET /spending/all/:userId
 */
export async function getAllTransactions(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const transactions = await dbGetAllTransactions(userId as string);
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}
