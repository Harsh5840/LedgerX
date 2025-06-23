import express, { RequestHandler, Router } from 'express';
import * as controller from '../controllers/transactionController';
import { requireRole } from '../middleware/roleMiddleware';
import { authenticateJWT } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(authenticateJWT as RequestHandler); // apply to all routes

router.post(
  '/create',
  requireRole('USER', 'ADMIN') as RequestHandler,
  controller.handleCreateTransaction as RequestHandler
);
router.get(
  '/all/:userId',
  requireRole('USER', 'ADMIN') as RequestHandler,
  controller.handleGetAllTransactions as RequestHandler
);


export default router;
