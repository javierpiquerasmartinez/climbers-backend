import { z } from 'zod';

export const createReviewSchema = z.object({
  authorId: z.string(),
  targetId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export const getUserReviewsSchema = z.object({
  id: z.string()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type GetUserReviewsInput = z.infer<typeof getUserReviewsSchema>;
