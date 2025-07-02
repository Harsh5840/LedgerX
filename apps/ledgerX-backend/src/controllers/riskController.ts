// apps/backend/src/controllers/riskController.ts

import { Request, Response } from "express";
import { assessRisk } from "../services/riskService";
import { LedgerEntryInput } from "../types/types"; // Custom input type without Prisma relations

export const handleRiskAssessment = async (req: Request, res: Response) => {
  try {
    const entry: LedgerEntryInput = req.body;

    const result = await assessRisk(entry );

    res.status(200).json({
      success: true,
      riskScore: result.totalRiskScore,
      isFlagged: result.isFlagged,
      tags: result.tags,
    });
  } catch (error) {
    console.error("Risk assessment failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
