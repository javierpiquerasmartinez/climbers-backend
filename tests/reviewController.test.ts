import { createReview, getReviewsForUser, getAverageRatingForUser } from '../src/controllers/reviewController';
import prismaTestClient from './prisma/prismaTestClient';
import { mockResponse } from './utils/mockResponse';
import { clearTestDb } from './utils/utils';

beforeEach(async () => {
  await clearTestDb();
});

describe('createReview', () => {
  let author: any, target: any;

  beforeEach(async () => {
    [author, target] = await prismaTestClient.$transaction([
      prismaTestClient.user.create({
        data: {
          name: 'Autor',
          email: 'autor@test.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      }),
      prismaTestClient.user.create({
        data: {
          name: 'Target',
          email: 'target@test.com',
          role: 'anfitrión',
          climbingStyles: ['sport'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      })
    ]);
  });

  it('creates a review successfully', async () => {
    const req: any = {
      body: {
        authorId: author.id,
        targetId: target.id,
        rating: 4,
        comment: 'Muy buena experiencia'
      }
    };
    const res = mockResponse();

    await createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      authorId: author.id,
      targetId: target.id,
      rating: 4
    }));
  });

  it('error when missing data', async () => {
    const req: any = { body: { authorId: author.id } };
    const res = mockResponse();

    await createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos obligatorios' });
  });

  it('error when an actor is reviewing himself', async () => {
    const req: any = {
      body: {
        authorId: author.id,
        targetId: author.id,
        rating: 5
      }
    };
    const res = mockResponse();

    await createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No puedes valorarte a ti mismo' });
  });

  it('error when the user has already been reviewed by the user', async () => {
    await prismaTestClient.review.create({
      data: {
        authorId: author.id,
        targetId: target.id,
        rating: 5
      }
    });

    const req: any = {
      body: {
        authorId: author.id,
        targetId: target.id,
        rating: 4
      }
    };
    const res = mockResponse();

    await createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ya has valorado a este usuario' });
  });
});

describe('getReviewsForUser', () => {
  let target: any, author: any;

  beforeEach(async () => {
    [target, author] = await prismaTestClient.$transaction([
      prismaTestClient.user.create({
        data: {
          name: 'Target',
          email: 'target@test.com',
          role: 'anfitrión',
          climbingStyles: ['sport'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      }),
      prismaTestClient.user.create({
        data: {
          name: 'Author',
          email: 'author@test.com',
          role: 'viajero',
          climbingStyles: ['boulder'],
          location: '',
          level: '',
          avatarUrl: ''
        }
      })
    ]);

    await prismaTestClient.review.create({
      data: {
        authorId: author.id,
        targetId: target.id,
        rating: 5,
        comment: '¡Genial!'
      }
    });
  });

  it('return the user reviews', async () => {
    const req: any = { params: { id: target.id } };
    const res = mockResponse();

    await getReviewsForUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        targetId: target.id,
        comment: '¡Genial!',
        author: expect.objectContaining({ id: author.id })
      })
    ]));
  });
});

describe('getAverageRatingForUser', () => {
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
        name: 'Carlos',
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
        name: 'Carlos',
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
        { authorId: user2.id, targetId: user1.id, rating: 4 },
        { authorId: user3.id, targetId: user1.id, rating: 5 }
      ]
    });
  });

  it('returns the average review rate and the number of reviews', async () => {
    const req: any = { params: { id: user1.id } };
    const res = mockResponse();

    await getAverageRatingForUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      averageRating: 4.5,
      totalReviews: 2
    });
  });
});
