import express, { RequestHandler, Router }   from 'express';
import {
  getTotalSpending,
  getTopCategories,
  getAllTransactions,
} from '../controllers/spendingController';
  import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router: Router = express.Router();

// Auth middleware for all routes
router.use(authenticateJWT as RequestHandler);

/**
 * GET /spending/total/:userId
 * Optional query params: category, month
 */
  router.get('/total/:userId', requireRole('USER', 'ADMIN') as RequestHandler, getTotalSpending as RequestHandler);

/**
 * GET /spending/top-categories/:userId
 */
router.get('/top-categories/:userId', requireRole('USER', 'ADMIN') as RequestHandler, getTopCategories as RequestHandler);

/**
 * GET /spending/all/:userId
 */
router.get('/all/:userId', requireRole('USER', 'ADMIN') as RequestHandler, getAllTransactions as RequestHandler);

export default router;
