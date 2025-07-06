// middleware/validateQuery.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: result.error.flatten(),
      });
    }
    req.query = result.data; // ✅ replace with parsed & typed data
    next();
  };
