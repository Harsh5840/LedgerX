// apps/backend/src/services/riskService.ts

import { LedgerEntry } from "@ledgerx/core";
import { analyzeFraud } from "./fraudService";
import { ruleBasedScore } from "@ledgerx/ai";

// Configurable thresholds
const TOTAL_RISK_THRESHOLD = parseInt(process.env.TOTAL_RISK_THRESHOLD || "60", 10);
const RULE_FLAG_THRESHOLD = parseInt(process.env.RULE_FLAG_THRESHOLD || "40", 10);

/**
 * Unified risk assessment combining ML-based and rule-based scoring
 */
export async function assessRisk(entry: LedgerEntry): Promise<{
  totalRiskScore: number;
  isFlagged: boolean;
  tags: string[];
}> {
  const fraudResult = await analyzeFraud(entry);  // ML score + heuristics
  const ruleScore = ruleBasedScore(entry);        // Domain rules (static)

  const totalRiskScore = fraudResult.riskScore + ruleScore;
  const isFlagged = totalRiskScore >= TOTAL_RISK_THRESHOLD;

  const tags = [
    ...fraudResult.reasons,
    ...(ruleScore >= RULE_FLAG_THRESHOLD ? ["Triggered business rule: high amount"] : []),
    ...(entry.isReversal ? ["Reversal transaction"] : []),
  ];

  return {
    totalRiskScore,
    isFlagged,
    tags,
  };
}
