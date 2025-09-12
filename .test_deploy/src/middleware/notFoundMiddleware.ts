// src/middleware/notFoundMiddleware.ts
import { Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: "🔍 Route not found" });
}
