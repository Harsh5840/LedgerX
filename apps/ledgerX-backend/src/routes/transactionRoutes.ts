import { Router } from 'express';
import {
  handleCreateTransaction,
  handleGetAllTransactions,
  handleTopCategories,
  handleTotalSpending,
} from '../controllers/transactionController';

const router: Router = Router();

// POST /transactions -> Create new debit-credit transaction
router.post('/', handleCreateTransaction);

// GET /transactions/:userId -> Get all transactions for a user
router.get('/:userId', handleGetAllTransactions);

// GET /transactions/:userId/top-categories?limit=5 -> Top spending categories
router.get('/:userId/top-categories', handleTopCategories);

// GET /transactions/:userId/total-spending?category=food&month=6 -> Total spending
router.get('/:userId/total-spending', handleTotalSpending);

export default router;
