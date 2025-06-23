import { RequestHandler, Router } from "express";
import {
  handleTotalSpending,
  handleTopCategories,
  handleMonthlyTrend,
  handleFlaggedOrRisky,
} from "../controllers/analyticsController";

const router : Router = Router();

// Route: GET /analytics/total?userId=...&category=...&month=...&year=...
router.get("/total", handleTotalSpending);

// Route: GET /analytics/top-categories?userId=...&month=...&year=...&limit=...
router.get("/top-categories", handleTopCategories);

// Route: GET /analytics/monthly-trend?userId=...
router.get("/monthly-trend", handleMonthlyTrend as RequestHandler);

// Route: GET /analytics/flagged?userId=...
router.get("/flagged", handleFlaggedOrRisky as RequestHandler);

export default router;
