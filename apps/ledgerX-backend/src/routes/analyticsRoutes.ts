import { RequestHandler, Router } from "express";
import {
  handleTotalSpending,
  handleTopCategories,
  handleMonthlyTrend,
  handleFlaggedOrRisky,
} from "../controllers/analyticsController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router: Router = Router();

// Apply JWT auth to all analytics routes
router.use(authenticateJWT as RequestHandler);

// Route: GET /analytics/total?userId=...&category=...&month=...&year=...
router.get(
  "/total",
  requireRole("USER", "ADMIN") as RequestHandler,
  handleTotalSpending as RequestHandler
);

// Route: GET /analytics/top-categories?userId=...&month=...&year=...&limit=...
router.get(
  "/top-categories",
  requireRole("USER", "ADMIN") as RequestHandler,
  handleTopCategories as RequestHandler
);

// Route: GET /analytics/monthly-trend?userId=...
router.get(
  "/monthly-trend",
  requireRole("USER", "ADMIN") as RequestHandler,
  handleMonthlyTrend as RequestHandler
);

// Route: GET /analytics/flagged?userId=...
router.get(
  "/flagged",
  requireRole("ADMIN", "USER", "AUDITOR") as RequestHandler,
  handleFlaggedOrRisky as RequestHandler
);

export default router;
