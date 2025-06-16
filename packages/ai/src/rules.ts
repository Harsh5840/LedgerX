import { LedgerEntry } from "@ledgerX/core";


export function ruleBasedScore(entry: LedgerEntry): number {
  let score = 0;

  if (entry.amount > 50000) {
    score += 40; 
  }


  const suspiciousAccounts = ['unknown', 'temp', 'misc'];
  //@ts-ignore
  if (suspiciousAccounts.includes(entry.account.toLowerCase())) {
    score += 30; 
  }

  const hour = new Date(entry.timestamp).getHours();
  if (hour < 6 || hour > 22) {
    score += 20; 
  }

  if (entry.isReversal) {
    score += 10;
  }

  return score;
}
