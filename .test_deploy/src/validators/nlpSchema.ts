// validators/nlp.schema.ts

import { z } from "zod";

export const nlpQuestionSchema = z.object({
  question: z.string().min(1, "Question must not be empty"),
});
