import express, { RequestHandler, Router } from 'express';
import * as controller from '../controllers/transactionController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router: Router = express.Router();

// Apply JWT middleware globally
router.use(authenticateJWT as RequestHandler);

// Helper to wrap async route handlers and enforce correct return type
function asyncHandler(fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Wrap async controllers to avoid TS issues and unhandled promise rejections
router.post(
  '/create',
  requireRole('USER', 'ADMIN') as RequestHandler,
  asyncHandler(async (req, res) => {
    await controller.handleCreateTransaction(req, res);
  })
);

router.get(
  '/all',
  requireRole('USER', 'ADMIN') as RequestHandler,
  asyncHandler(async (req, res) => {
    await controller.handleGetAllTransactions(req, res);
  })
);

router.post(
  '/reverse/:transactionId',
  requireRole('ADMIN') as RequestHandler,
  asyncHandler(async (req, res) => {
    await controller.handleReverseTransaction(req, res);
  })
);

export default router;
