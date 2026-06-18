import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(2, "Comment must be at least 2 characters").max(10000),
  threadId: z.number().int().positive(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(2).max(10000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
