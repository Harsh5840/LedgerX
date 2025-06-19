import axios from "axios";
import type { LedgerEntryInput } from "@ledgerX/core";

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;
const endpoint = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

const categories = [
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

/**
 * Classifies a ledger entry into a spending category using Hugging Face Zero-Shot Classification.
 * 
 * @param entry LedgerEntryInput - The user's transaction input (text or structured data).
 * @returns Predicted category as a string.
 */
export async function classifyCategory(entry: LedgerEntryInput): Promise<string> {
  const inputText = typeof entry.data === "string" ? entry.data : JSON.stringify(entry.data);

  try {
    const response = await axios.post(
      endpoint,
      {
        inputs: inputText,
        parameters: {
          candidate_labels: categories,
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

    return response.data?.labels?.[0] || "others";
  } catch (error: any) {
    console.error("Hugging Face API error:", error.response?.data || error.message);
    return "others";
  }
}
