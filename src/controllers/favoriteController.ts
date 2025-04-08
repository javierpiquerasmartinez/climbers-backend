import { Request, Response } from 'express';
import { FavoriteService } from '../services/favoriteService.js';

export const addFavorite = async (req: Request, res: Response) => {
  try {
    await FavoriteService.addFavorite(req.user, { favoriteId: req.params.favoriteId });
    res.status(201).json({ success: true, message: 'Favorito añadido' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al añadir el usuario como favorito' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    await FavoriteService.removeFavorite(req.user, { favoriteId: req.params.favoriteId });
    res.status(201).json({ success: true, message: 'Favorito añadido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar favorito' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await FavoriteService.getFavorites(req.user);
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener favoritos' });
  }
};
