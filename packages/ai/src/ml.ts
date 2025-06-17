// ml.ts (production-safe with Hugging Face Inference API)
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
 * Classify transaction text using Hugging Face API
 * @param entry LedgerEntryInput
 * @returns Predicted category
 */
export async function classifyCategory(entry: LedgerEntryInput): Promise<string> {
  const inputText = typeof entry.data === "string" ? entry.data : JSON.stringify(entry.data);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: inputText,
      parameters: {
        candidate_labels: categories,
        multi_label: false
      }
    })
  });

  if (!response.ok) {
    console.error("Failed to fetch from Hugging Face API:", await response.text());
    return "others";
  }

  const result = await response.json();
  return result?.labels?.[0] || "others";
}
