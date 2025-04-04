import { Request, Response } from 'express';
import cloudinary from '../lib/cloudinary.js';
import { UserModel } from '../models/userModel.js';
import * as userService from '../services/userService.js'

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.updateUser({ id: req.params.id, ...req.params })
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export const getUsersWithFilters = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.getUserWithFilters(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userConversations = await UserModel.getUserConversations(req.params);
    res.json(userConversations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {

  try {
    const userProfile = await UserModel.getUserProfile(req.params);
    res.json(userProfile)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil de usuario' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {

  const email = req.user?.email;

  if (!email) {
    res.status(401).json({ error: 'No autenticado' });
    return
  }

  try {
    const user = await UserModel.getCurrentUser({ email });
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  let email = req.user?.email;

  // Seguridad: asegurarse de que el usuario es dueño de la cuenta
  if (!email) {
    res.status(401).json({ error: 'No autorizado' });
    return
  }

  try {
    await UserModel.deleteUser({ ...req.params, email })
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
    const streamUpload = () =>
      new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'climbers/avatars',
            public_id: `user-${id}`,
            overwrite: true
          },
          (error, result) => {
            if (error || !result) return reject(error || new Error('Error en Cloudinary'));
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });

    const avatarUrl = await streamUpload();

    await UserModel.updateUserAvatarUrl({ id, avatarUrl })

    res.status(200).json({ avatarUrl });
  } catch (err) {
    console.error('Error al subir avatar:', err);
    res.status(500).json({ error: 'Error al subir avatar' });
  }
};
