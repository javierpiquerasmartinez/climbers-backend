import { Request, Response } from 'express';
import prisma from '../prisma/client.js';
import { getCurrentUser } from './userController.js';

export const addFavorite = async (req: Request, res: Response) => {

  const email = req.user?.email;
  if (!email) {
    res.status(401).json({ success: false, message: 'No autenticado' })
    return
  }
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Usuario no existe en la base de datos' })
      return
    }
    const userId = user.id;
    const favoriteId = req.params.favoriteId;

    if (userId === favoriteId) {
      res.status(400).json({ success: false, message: 'No puedes marcarte a ti mismo como favorito' });
      return;
    }

    await prisma.favorite.create({
      data: { userId, favoriteId }
    });

    res.status(201).json({ success: true, message: 'Favorito añadido' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al añadir el usuario como favorito' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  const email = req.user?.email;
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Usuario no existe en la base de datos' })
      return
    }
    const favoriteId = req.params.favoriteId;
    const userId = user.id;
    await prisma.favorite.delete({
      where: {
        userId_favoriteId: {
          userId,
          favoriteId
        }
      }
    });

    res.json({ success: true, message: 'Favorito eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar favorito' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  const email = req.user?.email;
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Usuario no existe en la base de datos' })
      return
    }
    const userId = user.id;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        favorite: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            // lo que quieras mostrar
          }
        }
      }
    });

    const formatted = favorites.map((fav) => fav.favorite);

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener favoritos' });
  }
};
