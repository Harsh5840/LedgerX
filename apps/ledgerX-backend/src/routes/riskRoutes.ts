import { Router, RequestHandler } from "express";
import { handleRiskAssessment } from "../controllers/riskController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router: Router = Router();

// POST /api/risk/assess — only accessible to ADMIN and AUDITOR
router.post(
  "/assess",
  authenticateJWT as RequestHandler,
  requireRole("ADMIN", "AUDITOR") as RequestHandler,
  handleRiskAssessment as RequestHandler
);

export default router;
