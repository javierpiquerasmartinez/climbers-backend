import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['anfitrión', 'viajero', 'ambos']).optional(),
  climbingStyles: z.array(z.string()).optional(),
  location: z.string().optional(),
  level: z.string().optional(),
  avatarUrl: z.string().optional()
});

export const updateUserSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['anfitrión', 'viajero', 'ambos']).optional(),
  climbingStyles: z.array(z.number()).optional(),
  location: z.string().optional(),
  level: z.number().optional()
});

export const userFiltersSchema = z.object({
  role: z.enum(['anfitrión', 'viajero', 'ambos']).optional(),
  style: z.array(z.string()).optional(),
  location: z.string().optional(),
  level: z.string().optional()
});

export const userConversationsRequestSchema = z.object({
  id: z.string()
});

export const userProfileRequestSchema = z.object({
  id: z.string()
});

export const deleteUserSchema = z.object({
  id: z.string()
});

export const updateAvatarSchema = z.object({
  id: z.string()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;
export type UserConversationsInput = z.infer<typeof userConversationsRequestSchema>;
export type UserProfileInput = z.infer<typeof userProfileRequestSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
