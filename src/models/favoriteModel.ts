import prisma from "../prisma/client.js";
import { errors } from "../utils/errors/index.js";

export class FavoriteModel {

  static async addFavorite({ userId, favoriteId }: { userId: string, favoriteId: string }) {
    try {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          favoriteId
        }
      })
      return favorite;
    } catch (error) {
      console.log(error)
      throw errors.internal("Error adding favorite");
    }
  }

  static async removeFavorite({ userId, favoriteId }: { userId: string, favoriteId: string }) {
    try {
      const favorite = await prisma.favorite.delete({
        where: {
          userId_favoriteId: {
            userId,
            favoriteId
          }
        }
      })
      return favorite;
    } catch (error) {
      throw errors.internal("Error removing favorite");
    }
  }

  static async getFavorites({ userId }: { userId: string }) {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          favorite: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      });
      return favorites;
    } catch (error) {
      throw errors.internal("Error getting favorites");
    }
  }
}