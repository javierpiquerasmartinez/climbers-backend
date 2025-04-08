import { Request, Response } from 'express';
import prisma from '../prisma/client.js';
import { ReviewService } from '../services/reviewService.js';

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await ReviewService.createReview(req.user, req.body)
    res.status(201).json(review);
  } catch (error) {
    console.error('Error al crear review:', error);
    res.status(500).json({ error: 'Error al crear review' });
  }
};

export const getReviewsForUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const reviews = await ReviewService.getReviewsForUser({ id });
    res.status(201).json(reviews);
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

export const getAverageRatingForUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const reviews = await ReviewService.getAverageRatingForUser({ id });
    res.status(201).json(reviews);
  } catch (error) {
    console.error('Error al calcular media de valoraciones:', error);
    res.status(500).json({ error: 'Error al calcular media de valoraciones' });
  }
};
