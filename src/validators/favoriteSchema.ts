import { z } from 'zod';

export const favoriteSchema = z.object({
  favoriteId: z.string()
});

export type FavoriteInput = z.infer<typeof favoriteSchema>;
