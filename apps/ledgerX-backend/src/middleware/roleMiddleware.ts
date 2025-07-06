// src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";

type Role = "USER" | "ADMIN" | "AUDITOR";

/**
 * Middleware to allow only users with specific roles
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    next();
  };
}

/**
 * Shortcut middleware for admin-only access
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole("ADMIN")(req, res, next);
}
