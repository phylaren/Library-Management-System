import { Request, Response } from 'express';
import { LoanService } from '../services/loanService';
import { createLoanSchema } from '../schemas/validation';
import { ErrorMessages } from '../schemas/errors'; 

const loanService = new LoanService();

export const getLoans = (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    
    const loans = loanService.getAllLoans(userId);
    res.json(loans);
};

export const createLoan = async (req: Request, res: Response) => {
    try {
        const validatedData = createLoanSchema.parse(req.body);
        
        const loan = await loanService.createLoan(validatedData.userId, validatedData.bookId);
        
        res.status(201).json(loan);
    } catch (error: any) {
        if (error.name === 'ZodError') {
             return res.status(400).json({ error: error.errors });
        }
        
        if (
            error.message === ErrorMessages.USER_NOT_FOUND || 
            error.message === ErrorMessages.BOOK_NOT_FOUND
        ) {
             return res.status(404).json({ error: error.message });
        }

        if (error.message === ErrorMessages.BOOK_NOT_AVAILABLE) {
             return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};

export const returnLoan = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        
        const loan = await loanService.returnBook(id);
        
        res.json(loan);
    } catch (error: any) {
        if (error.message === ErrorMessages.LOAN_NOT_FOUND) {
            return res.status(404).json({ error: error.message });
        }

        if (error.message === ErrorMessages.LOAN_ALREADY_RETURNED) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};