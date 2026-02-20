import { db } from '../storage/memoryStorage';
import { Loan } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { ErrorMessages } from '../schemas/errors';

export class LoanService {
  getAllLoans(userId?: string): Loan[] {
    const loans = Array.from(db.loans.values());
    if (userId) {
      return loans.filter(l => l.userId === userId);
    }
    return loans;
  }

  async createLoan(userId: string, bookId: string): Promise<Loan> {
    const user = db.users.get(userId);
    const book = db.books.get(bookId);
    
    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);
    if (!book) throw new Error(ErrorMessages.BOOK_NOT_FOUND);
    if (!book.available) throw new Error(ErrorMessages.BOOK_NOT_AVAILABLE);

    const newLoan: Loan = {
      id: uuidv4(),
      userId,
      bookId,
      loanDate: new Date(),
      returnDate: null,
      status: 'ACTIVE'
    };

    book.available = false;
    
    db.books.set(bookId, book);
    db.loans.set(newLoan.id, newLoan);

    await db.save(); 

    return newLoan;
  }

  async returnBook(loanId: string): Promise<Loan> {
    const loan = db.loans.get(loanId);
    
    if (!loan) throw new Error(ErrorMessages.LOAN_NOT_FOUND);
    if (loan.status === 'RETURNED') {
        throw new Error(ErrorMessages.LOAN_ALREADY_RETURNED);
    }

    loan.status = 'RETURNED';
    loan.returnDate = new Date();
    db.loans.set(loanId, loan);

    const book = db.books.get(loan.bookId);
    if (book) {
      book.available = true;
      db.books.set(book.id, book);
    }

    await db.save();

    return loan;
  }
}