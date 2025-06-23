// apps/backend/src/controllers/mlController.ts

import { Request, Response } from "express";
import { mlRiskScore } from "@ledgerX/ai";
import { LedgerEntry } from "@ledgerX/core";

export const handleMLRiskScore = async (req: Request, res: Response) => {
  try {
    const entry: LedgerEntry = req.body;
    const score = await mlRiskScore(entry);

    res.status(200).json({
      success: true,
      riskScore: score,
    });
  } catch (error) {
    console.error("ML risk scoring failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
