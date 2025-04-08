import { Request, Response } from 'express';
import { MessageService } from '../services/messageService.js';

export const sendMessage = async (req: Request, res: Response) => {

  try {
    const message = await MessageService.sendMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const messages = await MessageService.getConversation(req.query);
    res.status(201).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};
