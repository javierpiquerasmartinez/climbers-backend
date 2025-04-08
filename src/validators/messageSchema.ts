import { z } from 'zod';

export const sendMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1, 'El contenido del mensaje no puede estar vacío')
});

export const getMessagesSchema = z.object({
  user1: z.string(),
  user2: z.string()
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetConversationInput = z.infer<typeof getMessagesSchema>;
