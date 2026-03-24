import { prisma } from '../db/prisma';

export class LoanService {

  async getLoans(user: { userId: string; role: string }) {
    if (user.role === 'ADMIN') {
      return await prisma.loan.findMany({
        include: { book: true } 
      });
    } else {
      return await prisma.loan.findMany({
        where: { userId: user.userId },
        include: { book: true }
      });
    }
  }

  async createLoan(userId: string, bookId: string) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new Error('# Книга незнайдена');
    if (!book.available) throw new Error('# Книга недоступна');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('# Користувач незнайдений');
    
    const [loan] = await prisma.$transaction([
      prisma.loan.create({
        data: {
          userId,
          bookId,
          status: 'ACTIVE' 
        }
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { available: false }
      })
    ]);

    return loan;
  }

  async returnBook(loanId: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new Error('# Позика незнайдена');
    
    if (loan.status === 'RETURNED') throw new Error('# Позика вже повернута'); 

    const [updatedLoan] = await prisma.$transaction([
      prisma.loan.update({
        where: { id: loanId },
        data: {
          status: 'RETURNED',
          returnDate: new Date() 
        }
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: { available: true }
      })
    ]);

    return updatedLoan;
  }
}