// apps/backend/src/controllers/riskController.ts

import { Request, Response } from "express";
import { assessRisk } from "../services/riskService";
import { LedgerEntry } from "@ledgerx/core";

export const handleRiskAssessment = async (req: Request, res: Response) => {
  try {
    // Expect full LedgerEntry object including 'account'
    const entry: LedgerEntry = req.body;

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
