// validators/nlp.schema.ts

import { z } from "zod";

export const nlpQuerySchema = z.object({
  query: z.string().min(1, "Query must not be empty"),
});
