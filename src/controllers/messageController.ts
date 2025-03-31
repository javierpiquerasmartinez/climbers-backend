import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content) {
    res.status(400).json({ error: 'Datos incompletos' });
    return
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2 || typeof user1 !== 'string' || typeof user2 !== 'string') {
    res.status(400).json({ error: 'IDs de usuarios requeridos' });
    return
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.status(201).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};
