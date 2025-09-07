import { LedgerEntry } from "@ledgerX/types";

const suspiciousAccounts = ['unknown', 'temp', 'misc'];

export const RULE_RISK_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
};

export function ruleBasedScore(entry: LedgerEntry): number {
  let score = 0;

  if (entry.amount > 50000) score += 40;

  if (typeof entry.account === "string" && suspiciousAccounts.includes(entry.account.toLowerCase())) {
    score += 30;
  }

  const hour = new Date(entry.timestamp).getHours();
  if (hour < 6 || hour > 22) score += 20;

  if (entry.isReversal) score += 10;

  return score;
}

export function classifyRuleRisk(score: number): "low" | "medium" | "high" {
  if (score >= RULE_RISK_THRESHOLDS.HIGH) return "high";
  if (score >= RULE_RISK_THRESHOLDS.MEDIUM) return "medium";
  return "low";
}
