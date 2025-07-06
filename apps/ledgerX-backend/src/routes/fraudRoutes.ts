import { RequestHandler, Router } from "express";
import { handleFraudCheck } from "../controllers/fraudController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { validateQuery } from "../middleware/validateQuery";
import { fraudCheckSchema } from "../validators/fraudSchema";

const router: Router = Router();

router.use(authenticateJWT as RequestHandler);

router.post(
  "/check",
  requireRole("ADMIN", "AUDITOR") as RequestHandler,
  validateQuery(fraudCheckSchema) as RequestHandler,
  handleFraudCheck as RequestHandler
);

export default router;
