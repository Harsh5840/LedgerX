import { RequestHandler, Router } from "express";
import { handleNLPQuery } from "../controllers/nlpController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router: Router = Router();

// Apply authentication and restrict to USER or ADMIN
router.post(
  "/query",
  authenticateJWT as RequestHandler,
  requireRole("USER", "ADMIN") as RequestHandler,
  (req, res, next) => {
    Promise.resolve(handleNLPQuery(req, res)).catch(next);
  }
);

export default router;
