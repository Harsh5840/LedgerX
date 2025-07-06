import { z } from "zod";

export const fraudCheckSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().positive(),
  type: z.enum(["debit", "credit"]),
  category: z.string().optional(),
  timestamp: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid timestamp format",
  }),
  isReversal: z.boolean().optional(),
});
