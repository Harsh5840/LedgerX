// apps/backend/src/services/fraudService.ts

import { LedgerEntry } from "@ledgerX/core";
import { mlRiskScore } from "@ledgerx/ai";

// Configurable thresholds via ENV
const RISK_THRESHOLD = parseInt(process.env.RISK_THRESHOLD || "50", 10);
const HIGH_AMOUNT_THRESHOLD = parseFloat(process.env.HIGH_AMOUNT_THRESHOLD || "100000");

/**
 * Analyze a LedgerEntry and return fraud metadata
 */
export async function analyzeFraud(entry: LedgerEntry): Promise<{
  isFlagged: boolean;
  riskScore: number;
  reasons: string[];
  tags?: string[]; // optional for dashboard context
}> {
  const riskScore = await mlRiskScore(entry);
  const reasons: string[] = [];
  const tags: string[] = [];

  if (entry.amount > HIGH_AMOUNT_THRESHOLD) {
    reasons.push("High transaction amount");
    tags.push("high-amount");
  }

  if (!entry.category || entry.category === "others" || entry.category === "uncategorized") {
    reasons.push("Uncategorized transaction");
    tags.push("uncategorized");
  }

  const hour = new Date(entry.timestamp).getHours();
  if (hour < 6 || hour > 22) {
    reasons.push("Unusual transaction time");
    tags.push("odd-hour");
  }

  if (riskScore >= 80) {
    tags.push("critical");
  }

  const isFlagged = riskScore >= RISK_THRESHOLD;

  return {
    isFlagged,
    riskScore,
    reasons,
    tags,
  };
}
