import prisma from "../prisma/client.js";

export class MessageModel {
  static async sendMessage({ senderId, receiverId, content }: { senderId: string; receiverId: string; content: string }) {
    try {
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content
        }
      });
      return message;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw new Error('Error al enviar mensaje');
    }
  }

  static async getConversation(senderId: string, receiverId: string) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw new Error('Error al obtener mensajes');
    }
  }

}