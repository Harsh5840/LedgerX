// apps/backend/src/services/riskService.ts

import { LedgerEntry } from "@ledgerx/core";
import { analyzeFraud } from "./fraudService";
import { ruleBasedScore } from "@ledgerX/ai";

/**
 * Unified risk assessment combining ML-based and rule-based scoring
 */
export async function assessRisk(entry: LedgerEntry): Promise<{
  totalRiskScore: number;
  isFlagged: boolean;
  tags: string[];
}> {
  const fraudResult = await analyzeFraud(entry);  // Uses ML score + heuristic tags
  const ruleScore = ruleBasedScore(entry);        // Uses static business rules

  const totalRiskScore = fraudResult.riskScore + ruleScore;
  const isFlagged = totalRiskScore >= 60;

  const tags = [
    ...fraudResult.reasons,
    ...(ruleScore >= 40 ? ["Triggered business rule: high amount"] : []),
    ...(entry.isReversal ? ["Reversal transaction"] : []),
  ];

  return {
    totalRiskScore,
    isFlagged,
    tags,
  };
}
