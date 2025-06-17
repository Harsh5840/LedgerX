import { LedgerEntry } from "@ledgerx/core";

export async function mlRiskScore(entry: LedgerEntry): Promise<number> {  // we wrote Promise<number> because we are using async await

  await new Promise((resolve) => setTimeout(resolve, 100));   // we are using setTimeout to simulate the processing time

  let score = 0;

  if (entry.amount > 100000) score += 50;

  if (!entry.category || entry.category === "other") score += 20;

  const hour = new Date(entry.timestamp).getHours();
  if (hour < 6 || hour > 22) score += 15;

  return score;
}
