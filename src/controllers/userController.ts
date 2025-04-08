import { Request, Response } from 'express';
import { UserService } from '../services/userService.js'
import { AvatarService } from '../services/avatarService.js';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.updateSelf(req.user, { id: req.params.id, ...req.body })
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export const getUsersWithFilters = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUserWithFilters(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userConversations = await UserService.getUserConversations(req.user, { id: req.params.id });
    res.json(userConversations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {

  try {
    const userProfile = await UserService.getUserProfile({ id: req.params.id });
    res.json(userProfile)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil de usuario' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getCurrentUser(req.user);
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.user, { id: req.params.id })
    res.status(204).send(); // Sin contenido
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No se ha enviado ninguna imagen' });
    return
  }

  try {
    const avatarUrl = await AvatarService.uploadAvatar(req.user, { userId: id, file });
    await UserService.updateUserAvatarUrl(req.user, id, avatarUrl);
    res.status(200).json({ avatarUrl });
  } catch (err) {
    console.error('Error al subir avatar:', err);
    res.status(500).json({ error: 'Error al subir avatar' });
  }
};
