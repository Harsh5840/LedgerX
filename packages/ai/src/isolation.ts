import axios from "axios";
import { LedgerEntry } from "@ledgerx/core";

export async function isolationForestScore(entry: LedgerEntry): Promise<number> {
  const features = {
    amount: entry.amount,
    hour: new Date(entry.timestamp).getHours(),
    category: entry.category,
    account: entry.account,
    isReversal: entry.isReversal,
  };

  try {
    const response = await axios.post("http://localhost:8000/predict", features);
    return response.data?.anomaly_score ?? 0;
  } catch (err: any) {
    console.error("Isolation Forest scoring failed:", err.message);
    return 0;
  }
}
