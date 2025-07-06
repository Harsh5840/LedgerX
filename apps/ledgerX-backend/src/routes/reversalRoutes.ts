import express, { RequestHandler, Router } from 'express';
import { z } from 'zod';
import { handleReversal } from '../controllers/reversalController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router: Router = express.Router();

// ✅ Zod schema for route params
const reversalSchema = z.object({
  originalHash: z.string().regex(/^[a-fA-F0-9]{8,64}$/, {
    message: 'Invalid originalHash format',
  }),
});

// ✅ Middleware to validate request params using Zod
const validateReversalParams: RequestHandler = (req, res, next) => {
  const result = reversalSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }
  next();
};

// Optional: Audit log middleware
const auditLog: RequestHandler = (req, res, next) => {
  console.info(`[AUDIT] User ${req.user?.id} reversed transaction ${req.params.originalHash}`);
  next();
};

// ✅ POST /reversal/:originalHash/reverse
router.post(
  '/:originalHash/reverse',
  authenticateJWT as RequestHandler,
  requireRole('ADMIN', 'USER') as RequestHandler,
  validateReversalParams,
  auditLog,
  handleReversal as RequestHandler 
); 

export default router;
