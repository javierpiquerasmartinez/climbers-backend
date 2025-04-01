import { createUser, getUsersWithFilters, updateUser, getUserConversations, getUserProfile, getCurrentUser, deleteUser } from './../src/controllers/userController';
import prismaTestClient from './prisma/prismaTestClient';
import { mockResponse } from './utils/mockResponse';
import { clearTestDb } from './utils/utils';

beforeEach(async () => {
  await clearTestDb();
});


describe('User creation', () => {
  it('Successful creation', async () => {
    const req: any = {
      body: {
        name: 'Javi',
        email: 'javi@example.com',
        role: 'ambos',
        climbingStyles: ['boulder'],
        location: 'Valencia',
        level: 'intermediate',
        avatarUrl: 'http://avatar.com/javi.jpg'
      }
    };
    const res = mockResponse();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Javi',
      email: 'javi@example.com'
    }));
  });

  it('Error creating user - invalid request body', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear usuario' });
  });
});


describe('User update', () => {
  let user: any;

  beforeEach(async () => {
    user = await prismaTestClient.user.create({
      data: {
        name: 'Ana',
        email: 'ana@test.com',
        role: 'ambos',
        climbingStyles: ['sport'],
        location: 'Madrid',
        level: 'beginner',
        avatarUrl: ''
      }
    });
  });

  it('updates an existing user', async () => {
    const req: any = {
      params: { id: user.id },
      body: {
        role: 'viajero',
        location: 'Barcelona',
        climbingStyles: ['sport'],
        level: 'advanced'
      }
    };
    const res = mockResponse();

    await updateUser(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      role: 'viajero',
      location: 'Barcelona'
    }));
  });
});

describe('Get users based on filters', () => {
  beforeEach(async () => {
    await prismaTestClient.user.createMany({
      data: [
        {
          name: 'Mario',
          email: 'mario@test.com',
          role: 'viajero',
          climbingStyles: ['sport'],
          location: 'Granada',
          level: 'advanced',
          avatarUrl: ''
        },
        {
          name: 'Laura',
          email: 'laura@test.com',
          role: 'anfitrión',
          climbingStyles: ['boulder'],
          location: 'Valencia',
          level: 'beginner',
          avatarUrl: ''
        }
      ]
    });
  });

  it('Role and location filter', async () => {
    const req: any = {
      query: {
        role: 'viajero',
        location: 'Granada'
      }
    };
    const res = mockResponse();

    await getUsersWithFilters(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Mario' })
      ])
    );
  });

  it('Empty response when there is no match', async () => {
    const req: any = {
      query: {
        role: 'anfitrión',
        location: 'paris'
      }
    };
    const res = mockResponse();

    await getUsersWithFilters(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe('getUserConversations', () => {
  let userA: any, userB: any;

  beforeEach(async () => {
    [userA, userB] = await prismaTestClient.$transaction([
      prismaTestClient.user.create({
        data: {
          name: 'A',
          email: 'a@test.com',
          role: 'anfitrión',
          climbingStyles: ['sport'],
          location: 'Alicante',
          level: 'intermediate',
          avatarUrl: ''
        }
      }),
      prismaTestClient.user.create({
        data: {
          name: 'B',
          email: 'b@test.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: 'Murcia',
          level: 'beginner',
          avatarUrl: ''
        }
      })
    ]);

    await prismaTestClient.message.create({
      data: {
        senderId: userA.id,
        receiverId: userB.id,
        content: 'Hola!',
        createdAt: new Date()
      }
    });
  });

  it('returns the user conversations', async () => {
    const req: any = { params: { id: userA.id } };
    const res = mockResponse();

    await getUserConversations(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: userB.id,
          lastMessage: 'Hola!'
        })
      ])
    );
  });
});

describe('getUserProfile', () => {
  let user1: any;
  let user2: any;
  let user3: any;

  beforeEach(async () => {
    user1 = await prismaTestClient.user.create({
      data: {
        name: 'Carlos1',
        email: 'carlos1@test.com',
        role: 'anfitrión',
        climbingStyles: ['sport'],
        location: 'Toledo',
        level: 'advanced',
        avatarUrl: ''
      }
    });

    user2 = await prismaTestClient.user.create({
      data: {
        name: 'Carlos2',
        email: 'carlos2@test.com',
        role: 'anfitrión',
        climbingStyles: ['sport'],
        location: 'Toledo',
        level: 'advanced',
        avatarUrl: ''
      }
    });

    user3 = await prismaTestClient.user.create({
      data: {
        name: 'Carlos3',
        email: 'carlos3@test.com',
        role: 'anfitrión',
        climbingStyles: ['sport'],
        location: 'Toledo',
        level: 'advanced',
        avatarUrl: ''
      }
    });

    await prismaTestClient.review.createMany({
      data: [
        { targetId: user1.id, authorId: user2.id, rating: 4 },
        { targetId: user1.id, authorId: user3.id, rating: 5 }
      ]
    });
  });

  it('returns the user profile with average rating', async () => {
    const req: any = { params: { id: user1.id } };
    const res = mockResponse();

    await getUserProfile(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user1.id,
        averageRating: 4.5,
        totalReviews: 2
      })
    );
  });

  it('returns 404 if the user does not exist', async () => {
    const req: any = { params: { id: 'non-existent-id' } };
    const res = mockResponse();

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
  });
});

describe('getCurrentUser', () => {
  let user: any;

  beforeEach(async () => {
    user = await prismaTestClient.user.create({
      data: {
        name: 'Lucía',
        email: 'lucia@test.com',
        role: 'viajero',
        climbingStyles: ['boulder'],
        location: '',
        level: '',
        avatarUrl: ''
      }
    });
  });


  it('returns the current user if authenticated', async () => {
    const req: any = { user: { email: user.email } };
    const res = mockResponse();

    await getCurrentUser(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: user.email }));
  });

  it('returns 401 if there is no email in the token', async () => {
    const req: any = { user: {} };
    const res = mockResponse();

    await getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No autenticado' });
  });
});

describe('deleteUser', () => {
  let user: any;

  beforeEach(async () => {
    user = await prismaTestClient.user.create({
      data: {
        name: 'Pablo',
        email: 'pablo@test.com',
        role: 'viajero',
        climbingStyles: ['sport'],
        location: '',
        level: '',
        avatarUrl: ''
      }
    });
  });

  it('deletes the user if they own the profile', async () => {
    const req: any = {
      params: { id: user.id },
      user: { email: user.email }
    };
    const res = mockResponse();

    await deleteUser(req, res);

    const deleted = await prismaTestClient.user.findUnique({ where: { id: user.id } });
    expect(deleted).toBeNull();
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('returns 403 if another user tries to delete', async () => {
    const req: any = {
      params: { id: user.id },
      user: { email: 'otro@test.com' }
    };
    const res = mockResponse();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'No puedes eliminar otra cuenta' });
  });
});
