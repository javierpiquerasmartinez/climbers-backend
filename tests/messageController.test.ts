import { sendMessage, getConversation } from '../src/controllers/messageController';
import prismaTestClient from './prisma/prismaTestClient';
import { mockResponse } from './utils/mockResponse';
import { clearTestDb } from './utils/utils';

beforeEach(async () => {
  await clearTestDb();
});

describe('sendMessage', () => {
  let sender: any, receiver: any;

  beforeEach(async () => {
    [sender, receiver] = await prismaTestClient.$transaction([
      prismaTestClient.user.create({
        data: {
          name: 'Sender',
          email: 'sender@test.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      }),
      prismaTestClient.user.create({
        data: {
          name: 'Receiver',
          email: 'receiver@test.com',
          role: 'anfitrión',
          climbingStyles: ['sport'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      })
    ]);
  });

  it('envía un mensaje correctamente', async () => {
    const req: any = {
      body: {
        senderId: sender.id,
        receiverId: receiver.id,
        content: 'Hola, ¿nos vemos mañana?'
      }
    };
    const res = mockResponse();

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      senderId: sender.id,
      receiverId: receiver.id,
      content: 'Hola, ¿nos vemos mañana?'
    }));
  });

  it('devuelve error si faltan datos', async () => {
    const req: any = { body: { senderId: sender.id } };
    const res = mockResponse();

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Datos incompletos' });
  });
});

describe('getConversation', () => {
  let user1: any, user2: any;

  beforeEach(async () => {
    [user1, user2] = await prismaTestClient.$transaction([
      prismaTestClient.user.create({
        data: {
          name: 'User1',
          email: 'user1@test.com',
          role: 'anfitrión',
          climbingStyles: ['sport'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      }),
      prismaTestClient.user.create({
        data: {
          name: 'User2',
          email: 'user2@test.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      })
    ]);

    await prismaTestClient.message.createMany({
      data: [
        {
          senderId: user1.id,
          receiverId: user2.id,
          content: 'Hola!',
          createdAt: new Date(Date.now() - 10000)
        },
        {
          senderId: user2.id,
          receiverId: user1.id,
          content: '¡Qué tal!',
          createdAt: new Date()
        }
      ]
    });
  });

  it('devuelve la conversación ordenada por fecha', async () => {
    const req: any = {
      query: {
        user1: user1.id,
        user2: user2.id
      }
    };
    const res = mockResponse();

    await getConversation(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ content: 'Hola!' }),
      expect.objectContaining({ content: '¡Qué tal!' })
    ]);
  });

  it('devuelve error si faltan user1 o user2', async () => {
    const req: any = {
      query: { user1: user1.id }
    };
    const res = mockResponse();

    await getConversation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'IDs de usuarios requeridos' });
  });
});
