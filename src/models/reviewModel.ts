import prisma from "../prisma/client.js";

export class ReviewModel {

  static async findReview({ authorId, targetId }: any) {
    return await prisma.review.findFirst({
      where: {
        authorId,
        targetId
      }
    });
  }

  static async createReview({ authorId, targetId, rating, comment }: any) {
    try {
      const review = await prisma.review.create({
        data: {
          authorId,
          targetId,
          rating,
          comment
        }
      });
      return review;
    } catch (error) {
      console.error('Error al crear review:', error);
      throw new Error('Error al crear review');
    }
  }

  static async getReviewsForUser({ id }: any) {
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
      return reviews;
    } catch (error) {
      console.error('Error al obtener reviews:', error);
      throw new Error('Error al obtener reviews');
    }
  }

  static async getAverageRatingForUser({ id }: any) {
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
      return {
        averageRating: result._avg.rating,
        totalReviews: result._count.rating
      };
    } catch (error) {
      console.error('Error al calcular media de valoraciones:', error);
      throw new Error('Error al calcular media de valoraciones');
    }
  }

}