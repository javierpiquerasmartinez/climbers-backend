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
      orderBy: {
        createdAt: 'desc'
      }
    });

    const userMap = new Map<string, { userId: string; lastMessage: string; lastDate: Date }>();

    for (const msg of messages) {
      const otherId = msg.senderId === id ? msg.receiverId : msg.senderId;
      if (!userMap.has(otherId)) {
        userMap.set(otherId, {
          userId: otherId,
          lastMessage: msg.content,
          lastDate: msg.createdAt
        });
      }
    }

    const userIds = Array.from(userMap.keys());

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        location: true
      }
    });

    // Enlazar users con sus últimos mensajes
    const enriched = users.map(user => {
      const meta = userMap.get(user.id);
      return {
        ...user,
        lastMessage: meta?.lastMessage,
        lastDate: meta?.lastDate
      };
    });

    // Ordenar por fecha descendente
    enriched.sort((a, b) => (b.lastDate?.getTime() || 0) - (a.lastDate?.getTime() || 0));

    res.json(enriched);
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

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return
    }

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

export const getCurrentUser = async (req: Request, res: Response) => {

  const email = req.user?.email;

  if (!email) {
    res.status(401).json({ error: 'No autenticado' });
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Seguridad: asegurarse de que el usuario es dueño de la cuenta
  if (req.user?.email === undefined) {
    res.status(401).json({ error: 'No autorizado' });
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true }
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return
    }
    if (user.email !== req.user.email) {
      res.status(403).json({ error: 'No puedes eliminar otra cuenta' });
      return
    }

    await prisma.user.delete({ where: { id } });

    res.status(204).send(); // Sin contenido
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
