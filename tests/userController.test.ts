import { Request, Response } from 'express';
import prisma from './prisma/prismaTestClient';
import { clearTestDb } from './prisma/seedTest';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser, deleteUser, updateAvatar } from './../src/controllers/userController';


describe('User Controller', () => {
  let req: any;
  let res: Partial<Response>;

  beforeEach(async () => {
    req = {
      body: {},
      params: {},
      query: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Limpia la base de datos antes de cada prueba
    await clearTestDb();
  });

  describe('createUser', () => {

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

  describe('updateUser', () => {
    it('debería actualizar un usuario existente', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: 'Madrid',
          level: 'intermedio',
        },
      });

      req.params = { id: user.id };
      req.body = {
        role: 'ambos',
        location: 'Barcelona',
        climbingStyles: ['sport'],
        level: 'avanzado',
      };

      await updateUser(req as Request, res as Response);

      const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

      expect(updatedUser?.role).toBe('ambos');
      expect(updatedUser?.location).toBe('Barcelona');
      expect(updatedUser?.climbingStyles).toEqual(['sport']);
      expect(updatedUser?.level).toBe('avanzado');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: user.id,
        role: 'ambos',
        location: 'Barcelona',
      }));
    });

    it('debería devolver un error 500 si el usuario no existe', async () => {
      req.params = { id: 'non-existent-id' };
      req.body = { role: 'admin' };

      await updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar usuario' });
    });
  });

  describe('getUsersWithFilters', () => {
    it('debería devolver usuarios que coincidan con los filtros', async () => {
      await prisma.user.createMany({
        data: [
          { name: 'John', email: 'john@example.com', role: 'viajero', climbingStyles: ['boulder'], location: 'Madrid', level: 'intermedio' },
          { name: 'Jane', email: 'jane@example.com', role: 'ambos', climbingStyles: ['sport'], location: 'Barcelona', level: 'avanzado' },
        ],
      });

      req.query = { role: 'viajero', style: 'boulder', location: 'Madrid', level: 'intermedio' };

      await getUsersWithFilters(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'John', email: 'john@example.com' }),
      ]));
    });

    it('debería devolver un error 500 si ocurre un problema', async () => {
      req.query = { role: 'invalid-role' };

      await getUsersWithFilters(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener los usuarios' });
    });
  });

  describe('getUserConversations', () => {
    it('debería devolver conversaciones del usuario', async () => {
      const user1 = await prisma.user.create(
        {
          data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'viajero',
            climbingStyles: ['boulder'],
            location: 'Madrid',
            level: 'intermedio',
          }
        }
      );
      const user2 = await prisma.user.create(
        {
          data: {
            name: 'User2',
            email: 'user2@example.com',
            role: 'viajero',
            climbingStyles: ['boulder'],
            location: 'Madrid',
            level: 'intermedio',
          }
        }
      );

      await prisma.message.create({
        data: {
          senderId: user1.id,
          receiverId: user2.id,
          content: 'Hola',
        }
      })

      await prisma.message.create({
        data: {
          senderId: user1.id,
          receiverId: user2.id,
          content: 'Hola, ¿qué tal?'
        }
      })

      req.params = { id: user1.id };

      await getUserConversations(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'User2', lastMessage: 'Hola, ¿qué tal?' }),
      ]));
    });
  });

  describe('getUserProfile', () => {
    it('debería devolver el perfil del usuario con su rating', async () => {
      const user1 = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: 'Madrid',
          level: 'intermedio',
        }
      });
      const user2 = await prisma.user.create({
        data: {
          name: 'John 2Doe',
          email: 'john.dsoe@example.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: 'Madrid',
          level: 'intermedio',
        }
      });

      await prisma.review.createMany({
        data: [
          { targetId: user1.id, rating: 5, authorId: user2.id },
          { targetId: user1.id, rating: 4, authorId: user2.id },
        ],
      });

      req.params = { id: user1.id };

      await getUserProfile(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        averageRating: 4.5,
        totalReviews: 2,
      }));
    });

    it('debería devolver un error 404 si el usuario no existe', async () => {
      req.params = { id: 'non-existent-id' };

      await getUserProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario si está autorizado', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John 2Doe',
          email: 'john.dsoe@example.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: 'Madrid',
          level: 'intermedio',
        }
      });

      req.params = { id: user.id };
      req.user = { email: 'john.dsoe@example.com' };

      await deleteUser(req as Request, res as Response);

      const userInDb = await prisma.user.findUnique({ where: { id: user.id } });

      expect(userInDb).toBeNull();
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('debería devolver un error 403 si no está autorizado', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John 2Doe',
          email: 'john.dsoe@example.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: 'Madrid',
          level: 'intermedio',
        }
      });

      req.params = { id: user.id };
      req.user = { email: 'not-authorized@example.com' };

      await deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'No puedes eliminar otra cuenta' });
    });
  });
});