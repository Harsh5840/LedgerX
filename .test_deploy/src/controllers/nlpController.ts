import { Request, Response } from "express";
import { parseQueryWithLLM } from "@ledgerX/ai"; // LangChain-based parser
import { getTotalSpendingWithFilters, getTopCategoriesWithFilters } from "../services/analyticsService";

export const handleNLPQuery = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Missing query string." });
    }

    // ⛓️ Parse the question using LangChain LLM
    const parsed = await parseQueryWithLLM(question);

    if (!parsed || !parsed.intent) {
      return res.status(200).json({ success: false, type: "UNKNOWN", message: "Invalid NLP parsing." });
    }

    switch (parsed.intent) {
      case "TOTAL_SPENT": {
        const total = await getTotalSpendingWithFilters(parsed.filters || {});
        return res.status(200).json({ success: true, type: "TOTAL_SPENT", total });
      }

      case "TOP_CATEGORIES": {
        const categories = await getTopCategoriesWithFilters(parsed.filters || {}, parsed.limit || 3);
        return res.status(200).json({ success: true, type: "TOP_CATEGORIES", categories });
      }

      case "UNKNOWN":
      default:
        return res.status(200).json({ success: false, type: "UNKNOWN", message: "Could not understand query." });
    }
  } catch (error) {
    console.error("NLP query error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
