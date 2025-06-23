// apps/backend/src/controllers/fraudController.ts

import { Request, Response } from "express";
import { analyzeFraud } from "../services/fraudService";

export const handleFraudCheck = async (req: Request, res: Response) => {
  try {
    const transaction = req.body;
    const result = await analyzeFraud(transaction);
    res.status(200).json({
      success: true,
      fraudScore: result.riskScore,
      isFlagged: result.isFlagged,
      reasons: result.reasons,
    });
  } catch (error) {
    console.error("Fraud check failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
