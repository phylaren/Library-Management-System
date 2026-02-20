import { db } from '../storage/memoryStorage';
import { User } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  getAll(): User[] {
    return Array.from(db.users.values());
  }

  getById(id: string): User | undefined {
    return db.users.get(id);
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      ...data,
    };
    db.users.set(newUser.id, newUser);
    
    await db.save();
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = db.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...data };
    db.users.set(id, updatedUser);
    
    await db.save(); 
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const isDeleted = db.users.delete(id);
    
    if (isDeleted) {
      await db.save(); 
    }
    
    return isDeleted;
  }
}