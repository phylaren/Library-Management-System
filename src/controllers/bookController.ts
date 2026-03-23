import { Request, Response } from "express";
import { BookService } from "../services/bookService";
import { createBookSchema, updateBookSchema } from "../schemas/validation";
import { ErrorMessages } from '../schemas/errors'; 

const bookService = new BookService();

export const getBooks = async (req: Request, res: Response) => {
    const books = await bookService.getAllBooks(); 
    res.json(books);
};

export const getBookById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const book = await bookService.getBookById(req.params.id); 
        res.json(book);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const createBook = async (req: Request, res: Response) => {
    try {
        const validatedData = createBookSchema.parse(req.body);
        const book = await bookService.createBook(validatedData); 
        
        res.status(201).json(book);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};

export const updateBook = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = updateBookSchema.parse(req.body);

        const updatedBook = await bookService.updateBook(id, validatedData); 

        res.json(updatedBook);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        if (error.message === '# Книга незнайдена') {
            return res.status(404).json({ error: ErrorMessages.BOOK_NOT_FOUND });
        }
        res.status(500).json({ error: error.message });
    }
};

export const deleteBook = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params; 
        await bookService.deleteBook(id);

        res.status(200).json({ message: '# Книга успішно видалена' });
    } catch (error: any) {
        if (error.message === '# Книга незнайдена') {
            return res.status(404).json({ error: ErrorMessages.BOOK_NOT_FOUND });
        }
        res.status(500).json({ error: error.message });
    }
};