import { db } from '../storage/memoryStorage';
import { Book } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class BookService {
  getAll(): Book[] {
    return Array.from(db.books.values());
  }

  getById(id: string): Book | undefined {
    return db.books.get(id);
  }

  
  async create(data: Omit<Book, 'id' | 'available'>): Promise<Book> {
    const newBook: Book = {
      id: uuidv4(),
      ...data,
      available: true 
    };
    db.books.set(newBook.id, newBook);
    
    await db.save(); 
    return newBook;
  }

  async update(id: string, data: Partial<Book>): Promise<Book | null> {
    const book = db.books.get(id);
    if (!book) return null; 
    
    const updatedBook = { ...book, ...data };
    db.books.set(id, updatedBook);
    
    await db.save(); 
    return updatedBook;
  }

  async delete(id: string): Promise<boolean> {
    const isDeleted = db.books.delete(id);
    
    if (isDeleted) {
      await db.save(); 
    }
    
    return isDeleted;
  }
}