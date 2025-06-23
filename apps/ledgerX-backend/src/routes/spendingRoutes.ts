import express, { RequestHandler, Router }   from 'express';
import {
  handleTotalSpending,
  handleTopCategories,
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
  router.get('/total/:userId', requireRole('USER', 'ADMIN') as RequestHandler, handleTotalSpending as RequestHandler);

/**
 * GET /spending/top-categories/:userId
 */
router.get('/top-categories/:userId', requireRole('USER', 'ADMIN') as RequestHandler, handleTopCategories as RequestHandler);

/**
 * GET /spending/all/:userId
 */

export default router;
