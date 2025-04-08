import prisma from "../prisma/client";

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
      throw new Error("Error adding favorite");
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
      throw new Error("Error removing favorite");
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
      throw new Error("Error getting favorites");
    }
  }
}