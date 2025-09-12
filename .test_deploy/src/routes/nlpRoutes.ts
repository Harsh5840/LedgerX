import { RequestHandler, Router } from "express";
import { handleNLPQuery } from "../controllers/nlpController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { validateQuery } from "../middleware/validateQuery";
import { nlpQuestionSchema } from "../validators/nlpSchema";

const router: Router = Router();

router.post(
  "/query",
  authenticateJWT as RequestHandler,
  requireRole("USER", "ADMIN") as RequestHandler,
  validateQuery(nlpQuestionSchema) as RequestHandler,
  (req, res, next) => {
    handleNLPQuery(req, res).catch(next); // inline error handling for async
  }
);

export default router;
