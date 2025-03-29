import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/client.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: 'Token no proporcionado' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: 'Token inválido' });

    const { email, name, picture } = payload;

    if (!email || !name) {
      res.status(400).json({ error: 'Datos de usuario incompletos' });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatarUrl: picture,
          role: 'viajero', // Por defecto, se puede editar luego
          climbingStyles: [],
        }
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
