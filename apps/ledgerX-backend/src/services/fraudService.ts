// apps/backend/src/services/fraudService.ts

import { LedgerEntry } from "@ledgerx/core";
import { mlRiskScore } from "@ledgerx/ai";

/**
 * Analyze a LedgerEntry and return fraud metadata
 */
export async function analyzeFraud(entry: LedgerEntry): Promise<{
  isFlagged: boolean;
  riskScore: number;
  reasons: string[];
}> {
  const riskScore = await mlRiskScore(entry);
  const reasons: string[] = [];

  if (entry.amount > 100000) {
    reasons.push("High transaction amount");
  }

  if (!entry.category || entry.category === "other") {
    reasons.push("Uncategorized transaction");
  }

  const hour = new Date(entry.timestamp).getHours();
  if (hour < 6 || hour > 22) {
    reasons.push("Unusual transaction time");
  }

  const isFlagged = riskScore >= 50;

  return {
    isFlagged,
    riskScore,
    reasons,
  };
}
