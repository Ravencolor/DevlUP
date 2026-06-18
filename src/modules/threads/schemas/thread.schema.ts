import { z } from "zod";

export const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(50000),
  tags: z.array(z.string().min(1).max(30)).max(5).default([]),
});

export const updateThreadSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  content: z.string().min(10).max(50000).optional(),
  tags: z.array(z.string().min(1).max(30)).max(5).optional(),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type UpdateThreadInput = z.infer<typeof updateThreadSchema>;
