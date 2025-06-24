import express, { RequestHandler, Router } from 'express';
import * as controller from '../controllers/transactionController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router: Router = express.Router();

router.use(authenticateJWT as RequestHandler); // applies to all routes

router.post(
  '/create',
  requireRole('USER', 'ADMIN') as RequestHandler,
  controller.handleCreateTransaction as RequestHandler
);

router.get(
  '/all',
  requireRole('USER', 'ADMIN') as RequestHandler,
  controller.handleGetAllTransactions as RequestHandler
);

router.post(
  '/reverse/:transactionId',
  requireRole('ADMIN') as RequestHandler,
  controller.handleReverseTransaction as RequestHandler
);

export default router;
