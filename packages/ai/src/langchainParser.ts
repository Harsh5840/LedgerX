import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

dotenv.config(); // Load environment variables

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in the .env file");
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

const model = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  temperature: 0.3,
  model: "gemini-1.5-flash", // or "gemini-1.5-pro" for more complex tasks
});

const parser = new StringOutputParser();

const chain = RunnableSequence.from([
  prompt,
  model,
  parser,
]);

export async function parseQueryWithLangChain(question: string) {
    let output: string | undefined;
    try {
      output = await chain.invoke({ question });
      // Remove Markdown code block if present
      output = output.trim();
      if (output.startsWith("```")) {
        output = output.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
      }
      const parsed = JSON.parse(output);
      return parsed;
    } catch (err) {
      console.error("Failed to parse output:", output, err);
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