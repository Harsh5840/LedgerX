import { RequestHandler, Router } from "express";
import { handleFraudCheck } from "../controllers/fraudController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router: Router = Router();

// Apply auth middleware
router.use(authenticateJWT as RequestHandler);

// Route: POST /fraud/check — Only admins and auditors should access this
router.post(
  "/check",
  requireRole("ADMIN", "AUDITOR") as RequestHandler,
  handleFraudCheck as RequestHandler
);

export default router;
