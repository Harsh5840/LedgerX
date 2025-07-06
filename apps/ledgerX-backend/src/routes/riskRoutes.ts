import { Router, RequestHandler } from "express";
import { handleRiskAssessment } from "../controllers/riskController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router: Router = Router();

router.post(
  "/assess",
  authenticateJWT as RequestHandler,
  requireRole("ADMIN", "AUDITOR") as RequestHandler,
  (req, res, next) => {
    Promise.resolve(handleRiskAssessment(req, res)).catch(next);
  }
);

export default router;
