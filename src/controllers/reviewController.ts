import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createReview = async (req: Request, res: Response) => {
  const { authorId, targetId, rating, comment } = req.body;

  if (!authorId || !targetId || !rating) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
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
