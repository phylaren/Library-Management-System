import { prisma } from '../db/prisma';

export class UserService {
  
  async getAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      }
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      }
    });
    
    if (!user) return null;
    return user;
  }

  async create(data: any) {
    return await prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, }
    });
  }

  async update(id: string, data: any) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, avatarUrl: true, }
      });
    } catch (error) {
      return null; 
    }
  }

  async delete(id: string) {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false; 
    }
  }
}