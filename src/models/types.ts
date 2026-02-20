export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  isbn: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type LoanStatus = 'ACTIVE' | 'RETURNED';

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  loanDate: Date;
  returnDate: Date | null;
  status: LoanStatus;
}