import { Prisma, User } from "@prisma/client";
import prisma from "../prisma/client.js";

export class UserModel {
  static async createUser({ name, email, role, climbingStyles, location, level, avatarUrl }: any) {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role,
          climbingStyles,
          location,
          level,
          avatarUrl,
        },
      });
      return user;
    } catch (err) {
      console.log(err)
      throw new Error('Error creating user');
    }
  }

  static async updateUser({ id, role, location, climbingStyles, level }: any) {
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
      return user;
    }
    catch (err) {
      throw new Error('Error updating user');
    }
  }

  static async getUserWithFilters({ role, style, location, level }: any) {
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

      return users;
    } catch (err) {
      throw new Error('Error filtering users')
    }

  }

  static async getUserConversations({ id }: any) {
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

      return enriched;
    } catch (err) {
      throw new Error('Error getting user conversaitons')
    }
  }

  static async getUserProfile({ id }: any) {
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
        throw new Error('User not found');
        return
      }

      const rating = await prisma.review.aggregate({
        where: { targetId: id },
        _avg: { rating: true },
        _count: { rating: true }
      });

      return ({
        ...user,
        averageRating: rating._avg.rating,
        totalReviews: rating._count.rating
      });
    } catch (error) {
      throw new Error('Error retrieving user profile');
    }
  }

  static async getCurrentUser({ email }: any) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch (err) {
      throw new Error('Error obteniendo informacion de usuario')
    }
  }

  static async deleteUser({ id, email }: any) {
    try {
      await prisma.user.delete({
        where: { id, email }
      });
    } catch {
      throw new Error('Error eliminando usuario');
    }
  }

  static async updateUserAvatarUrl({ id, avatarUrl }: any) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          avatarUrl
        }
      });
      return user;
    }
    catch (err) {
      throw new Error('Error updating user');
    }
  }

  static async findByEmail({ email }: any) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      return user;
    } catch (err) {
      throw new Error('Error finding user by email');
    }
  }

  static async findById({ id }: any) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding user by id');
    }
  }
}