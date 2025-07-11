// packages/ai/langchainParser.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the .env file");
}

const prompt = PromptTemplate.fromTemplate(`
You are a financial query parser for a personal finance dashboard. 
Given a user's natural language question, extract their intent and any filters like category, month, and year.
Reply strictly in this JSON format:
{{
  "intent": "TOTAL_SPENT" | "TOP_CATEGORIES" | "UNKNOWN",
  "filters": {{
    "category": string (optional),
    "month": number (0-11, optional),
    "year": number (4-digit, optional)
  }},
  "limit": number (optional, for TOP_CATEGORIES only)
}}

User question: {question}
`);

const model = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.3,
  modelName: "gpt-4", // or "gpt-3.5-turbo"
});

const parser = new StringOutputParser();

const chain = RunnableSequence.from([
  prompt,
  model,
  parser,
]);

export async function parseQueryWithLangChain(question: string) {
  try {
    const output = await chain.invoke({ question });
    const parsed = JSON.parse(output);
    return parsed;
  } catch (err) {
    console.error("Failed to parse output:", output);
    return {
      intent: "UNKNOWN",
      filters: {},
    };
  }
}

// Export the function with the original name as well for backward compatibility
export async function parseQueryWithLLM(question: string) {
  return parseQueryWithLangChain(question);
}