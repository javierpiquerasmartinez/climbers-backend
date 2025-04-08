import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/client.js';
import axios from 'axios';
import cloudinary from '../lib/cloudinary.js';
import { UserService } from '../services/userService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: 'Token no proporcionado' });
    return
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ error: 'Token inválido' });
      return
    }

    const { email, name, picture } = payload;

    if (!email || !name) {
      res.status(400).json({ error: 'Datos de usuario incompletos' });
      return
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await UserService.createUser({ name, email, avatarUrl: picture });

      if (picture) {
        const avatarUrl = await downloadAndUploadAvatar(picture, user.id);

        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl }
        });
      }

    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

async function downloadAndUploadAvatar(url: string, userId: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  const uploadRes = await cloudinary.uploader.upload_stream({
    folder: 'climbers/avatars',
    public_id: `user-${userId}`,
    overwrite: true
  }, (error, result) => {
    if (error || !result) throw new Error('Error al subir imagen a Cloudinary');
    return result.secure_url;
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'climbers/avatars',
        public_id: `user-${userId}`,
        overwrite: true
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Error al subir imagen'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(response.data);
  });
}
