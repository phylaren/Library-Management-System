import { prisma } from '../db/prisma';

export class BookService {
  async getAllBooks() {
    return await prisma.book.findMany();
  }

  async getBookById(id: string) {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) throw new Error('# Книга незнайдена');
    return book;
  }

  async createBook(data: any) {
    return await prisma.book.create({ data });
  }

  async updateBook(id: string, data: any) {
    try {
      return await prisma.book.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new Error('# Книга незнайдена'); 
    }
  }

  async deleteBook(id: string) {
    try {
      await prisma.book.delete({ where: { id } });
      return { message: '# Книга видалена успішно' };
    } catch (error) {
      throw new Error('# Книга незнайдена');
    }
  }
}