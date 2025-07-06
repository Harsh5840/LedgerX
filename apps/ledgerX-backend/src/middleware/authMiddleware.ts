// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("❌ JWT_SECRET is not defined in environment");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token as string, secret) as { id: string; role: "USER" | "ADMIN" | "AUDITOR" };
    req.user = decoded as {
      id: string;
      role: "USER" | "ADMIN" | "AUDITOR";
      email?: string;
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
