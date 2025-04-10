import { Request, Response } from 'express';
import { FavoriteService } from '../services/favoriteService.js';

export const addFavorite = async (req: Request, res: Response) => {
  await FavoriteService.addFavorite(req.user, { favoriteId: req.params.favoriteId });
  res.status(201).json({ success: true, message: 'Favorito añadido' });
};

export const removeFavorite = async (req: Request, res: Response) => {
  await FavoriteService.removeFavorite(req.user, { favoriteId: req.params.favoriteId });
  res.status(201).json({ success: true, message: 'Favorito añadido' });
};

export const getFavorites = async (req: Request, res: Response) => {
  const favorites = await FavoriteService.getFavorites(req.user);
  res.json(favorites);
};
