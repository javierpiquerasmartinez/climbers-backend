import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, role, climbingStyles, location, level, avatarUrl } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        climbingStyles,
        location,
        level,
        avatarUrl
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, location, climbingStyles, level } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        role,
        location,
        climbingStyles,
        level
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

export const getUsersWithFilters = async (req: Request, res: Response) => {
  const { role, style, location, level } = req.query;

  const filters: Prisma.UserWhereInput = {}

  if (role && typeof role === 'string') {
    filters.role = role as any;
  }

  if (style && typeof style === 'string') {
    filters.climbingStyles = {
      has: style.toLowerCase()
    }
  }

  if (location && typeof location === 'string') {
    filters.location = {
      contains: location,
      mode: 'insensitive'
    }
  }

  if (level && typeof level === 'string') {
    filters.level = {
      equals: level,
      mode: 'insensitive'
    }
  }

  try {
    const users = await prisma.user.findMany({
      where: filters
    })

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

export const getUserConversations = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: id },
          { receiverId: id }
        ]
      },
      select: {
        senderId: true,
        receiverId: true
      }
    });

    const userIds = new Set<string>();

    messages.forEach((msg) => {
      if (msg.senderId !== id) userIds.add(msg.senderId);
      if (msg.receiverId !== id) userIds.add(msg.receiverId);
    });

    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(userIds) }
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        location: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        location: true,
        climbingStyles: true,
        level: true,
        createdAt: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const rating = await prisma.review.aggregate({
      where: { targetId: id },
      _avg: { rating: true },
      _count: { rating: true }
    });

    res.json({
      ...user,
      averageRating: rating._avg.rating,
      totalReviews: rating._count.rating
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ error: 'Error al obtener perfil de usuario' });
  }
};
