import { createUser } from './../src/controllers/userController';
import { Request, Response } from 'express';
import prisma from './prisma/prismaTestClient';

describe('createUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(async () => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Limpia la base de datos antes de cada prueba
    await prisma.user.deleteMany();
  });

  it('debería crear un usuario y devolver un código 201', async () => {
    req.body = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'viajero',
      climbingStyles: ['boulder', 'sport'],
      location: 'Madrid',
      level: 'intermedio',
      avatarUrl: 'http://example.com/avatar.jpg',
    };

    await createUser(req as Request, res as Response);

    // Verifica que el usuario se haya creado en la base de datos
    const userInDb = await prisma.user.findUnique({
      where: { email: 'john.doe@example.com' },
    });

    expect(userInDb).not.toBeNull();
    expect(userInDb?.name).toBe('John Doe');
    expect(userInDb?.email).toBe('john.doe@example.com');

    // Verifica la respuesta
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john.doe@example.com',
    }));
  });

  it('debería devolver un error 500 si ocurre un error al crear el usuario', async () => {
    // Simula un caso donde falta un campo obligatorio
    req.body = {
      name: 'John Doe',
      role: 'viajero',
    };

    await createUser(req as Request, res as Response);

    // Verifica que no se haya creado ningún usuario
    const usersInDb = await prisma.user.findMany();
    expect(usersInDb).toHaveLength(0);

    // Verifica la respuesta
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear usuario' });
  });
});