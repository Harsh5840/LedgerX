import express, { RequestHandler, Router } from 'express';
import { handleReversal } from '../controllers/reversalController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router: Router = express.Router();

// POST /reversal/:originalHash/reverse
router.post(
  '/:originalHash/reverse',
  authenticateJWT as RequestHandler,
  requireRole('ADMIN', 'USER') as RequestHandler,
  handleReversal as RequestHandler
);

export default router;
