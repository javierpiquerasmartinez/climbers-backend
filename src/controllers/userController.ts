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