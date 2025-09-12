import { z } from "zod";

export const totalSpendingQuerySchema = z.object({
  userId: z.coerce
    .string()
    .trim()
    .nonempty({ message: "userId is required" })
    .uuid({ message: "Invalid UUID format" }),
  category: z.string().optional(),
  month: z
    .string()
    .transform(Number)
    .refine((val) => val >= 1 && val <= 12, { message: "Month must be between 1 and 12" })
    .optional(),
  year: z
    .string()
    .transform(Number)
    .refine((val) => val >= 2000 && val <= 2100, { message: "Invalid year" })
    .optional(),
});

export const topCategoriesQuerySchema = z.object({
  userId: z
    .string()
    .trim()
    .nonempty({ message: "userId is required" })
    .uuid({ message: "Invalid UUID format" }),
  month: z
    .string()
    .transform(Number)
    .refine((val) => val >= 1 && val <= 12, { message: "Month must be between 1 and 12" })
    .optional(),
  year: z
    .string()
    .transform(Number)
    .refine((val) => val >= 2000 && val <= 2100, { message: "Invalid year" })
    .optional(),
  limit: z
    .string()
    .transform(Number)
    .refine((val) => val >= 1 && val <= 10, { message: "Limit must be 1-10" })
    .optional(),
});

export const monthlyTrendQuerySchema = z.object({
  userId: z
    .string()
    .trim()
    .nonempty({ message: "userId is required" })
    .uuid({ message: "Invalid UUID format" }),
});

export const flaggedQuerySchema = z.object({
  userId: z
    .string()
    .trim()
    .nonempty({ message: "userId is required" })
    .uuid({ message: "Invalid UUID format" }),
});
