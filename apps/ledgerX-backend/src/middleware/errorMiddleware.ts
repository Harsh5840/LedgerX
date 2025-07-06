// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("❌ Unhandled Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}
