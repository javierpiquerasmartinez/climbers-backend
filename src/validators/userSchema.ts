import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.array(z.enum(['anfitrión', 'viajero', 'ambos'])).optional(),
  climbingStyles: z.array(z.string()).optional(),
  location: z.string().optional(),
  level: z.string().optional(),
  avatarUrl: z.string().optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
