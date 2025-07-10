import { Request, Response } from "express";
import {
  getTotalSpendingWithFilters,
  getTopCategoriesWithFilters,
  getMonthlySpendingTrend,
  getFlaggedOrRiskyEntries,
} from "../services/analyticsService";

// GET /analytics/total
export const handleTotalSpending = async (req: Request, res: Response) => {
  try {
    const { userId, category, month, year } = req.query;

    const total = await getTotalSpendingWithFilters({
      userId: userId as string,
      category: category as string,
      month: month !== undefined ? parseInt(month as string) : undefined,
      year: year !== undefined ? parseInt(year as string) : undefined,
    });

    res.status(200).json({ success: true, total });
  } catch (error) {
    console.error("❌ Failed to get total spending:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// GET /analytics/top-categories
export const handleTopCategories = async (req: Request, res: Response) => {
  try {
    const { userId, month, year, limit } = req.query;

    const categories = await getTopCategoriesWithFilters(
      {
        userId: userId as string,
        month: month !== undefined ? parseInt(month as string) : undefined,
        year: year !== undefined ? parseInt(year as string) : undefined,
      },
      limit !== undefined ? parseInt(limit as string) : 3
    );

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("❌ Failed to get top categories:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// GET /analytics/monthly-trend
export const handleMonthlyTrend = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const trend = await getMonthlySpendingTrend(userId as string);
    res.status(200).json({ success: true, trend });
  } catch (error) {
    console.error("❌ Failed to get monthly trend:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// GET /analytics/flagged
export const handleFlaggedOrRisky = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const flagged = await getFlaggedOrRiskyEntries(userId as string);
    res.status(200).json({ success: true, flagged });
  } catch (error) {
    console.error("❌ Failed to get flagged entries:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
