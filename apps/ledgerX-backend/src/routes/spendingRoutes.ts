import { Router } from 'express';
import {
  getUserSpending,
  getUserTopCategories,
  getUserTransactions,
} from '../controllers/spendingController';

const router = Router();

// GET /spending/total?userId=123&month=6&category=food
router.get('/total', getUserSpending);

// GET /spending/top?userId=123&limit=5
router.get('/top', getUserTopCategories);

// GET /spending/all?userId=123
router.get('/all', getUserTransactions);

export default router;
