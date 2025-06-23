// apps/backend/src/controllers/riskController.ts

import { Request, Response } from "express";
import { assessRisk } from "../services/riskService";

export const handleRiskAssessment = async (req: Request, res: Response) => {
  try {
    const entry = req.body; // Make sure this is a valid LedgerEntry

    const result = await assessRisk(entry);

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
