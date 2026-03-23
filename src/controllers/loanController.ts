import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; 
import { LoanService } from '../services/loanService';
import { createLoanSchema } from '../schemas/validation';

const loanService = new LoanService();

export const getLoans = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: '# Не авторизовано' });
        
        const loans = await loanService.getLoans(req.user);
        res.json(loans);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createLoan = async (req: AuthRequest, res: Response) => {
    try {
        const validatedData = createLoanSchema.parse(req.body);
        
        const loan = await loanService.createLoan(validatedData.userId, validatedData.bookId);
        res.status(201).json(loan);
    } catch (error: any) {
        if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
        if (error.message === '# Користувач незнайдений' || error.message === '# Книга незнайдена') return res.status(404).json({ error: error.message });
        if (error.message === '# Книга недоступна') return res.status(400).json({ error: error.message });
        
        res.status(500).json({ error: error.message });
    }
};

export const returnLoan = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const loan = await loanService.returnBook(id as string);
        res.json(loan);
    } catch (error: any) {
        if (error.message === '# Позика незнайдена') return res.status(404).json({ error: error.message });
        if (error.message === '# Ця книга вже була повернута раніше') return res.status(400).json({ error: error.message });
        
        res.status(500).json({ error: error.message });
    }
};