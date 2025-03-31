import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export const createReview = async (req: Request, res: Response) => {
  const { authorId, targetId, rating, comment } = req.body;

  if (!authorId || !targetId || !rating) {
    res.status(400).json({ error: 'Faltan datos obligatorios' });
    return
  }

  if (authorId === targetId) {
    res.status(400).json({ error: 'No puedes valorarte a ti mismo' });
    return;
  }

  // Check if the author has already reviewed the target
  try {
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId,
        targetId
      }
    })

    if (existingReview) {
      res.status(400).json({ error: 'Ya has valorado a este usuario' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        authorId,
        targetId,
        rating,
        comment
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error al crear review:', error);
    res.status(500).json({ error: 'Error al crear review' });
  }
};

export const getReviewsForUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        targetId: id
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(201).json(reviews);
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

export const getAverageRatingForUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await prisma.review.aggregate({
      where: {
        targetId: id
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    res.json({
      averageRating: result._avg.rating,
      totalReviews: result._count.rating
    });
  } catch (error) {
    console.error('Error al calcular media de valoraciones:', error);
    res.status(500).json({ error: 'Error al calcular media de valoraciones' });
  }
};
