import axios from "axios";
import type { LedgerEntryInput } from "@ledgerX/core";
import dotenv from "dotenv";

dotenv.config();

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;
console.log("🔑 Hugging Face API token:", HUGGINGFACE_API_TOKEN);
const endpoint = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

export const CATEGORY_LABELS = [
  "food",
  "transport",
  "housing",
  "entertainment",
  "shopping",
  "health",
  "utilities",
  "travel",
  "education",
  "investment",
  "others"
];


export async function classifyCategory(entry: LedgerEntryInput): Promise<string> {
  const inputText = typeof entry.data === "string"
    ? entry.data.trim().toLowerCase()
    : JSON.stringify(entry.data).toLowerCase();

  try {
    const response = await axios.post(
      endpoint,
      {
        inputs: inputText,
        parameters: {
          candidate_labels: CATEGORY_LABELS,
          multi_label: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const topLabel = response.data?.labels?.[0];
    const topScore = response.data?.scores?.[0];

    if (!topLabel || topScore < 0.5) return "others";
    return topLabel;
  } catch (error: any) {
    console.error("Hugging Face API error:", error.response?.data || error.message);
    return "others";
  }
}
