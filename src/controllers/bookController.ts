import { Request, Response } from "express";
import { BookService } from "../services/bookService";
import { createBookSchema, updateBookSchema } from "../schemas/validation";
import { ErrorMessages } from '../schemas/errors'; 

const bookService = new BookService();

export const getBooks = (req: Request, res: Response) => {
    const books = bookService.getAll();
    res.json(books);
};

export const getBookByID = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const book = bookService.getById(id as string);

        if (!book) {
            return res.status(404).json({ error: ErrorMessages.BOOK_NOT_FOUND });
        }

        res.json(book);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createBook = async (req: Request, res: Response) => {
    try {
        const validatedData = createBookSchema.parse(req.body);
        const book = await bookService.create(validatedData);
        
        res.status(201).json(book);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = updateBookSchema.parse(req.body);

        const updatedBook = await bookService.update(id as string, validatedData);

        if (!updatedBook) {
            return res.status(404).json({ error: ErrorMessages.BOOK_NOT_FOUND });
        }

        res.json(updatedBook);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const isDeleted = await bookService.delete(id as string);

        if (!isDeleted) {
            return res.status(404).json({ error: ErrorMessages.BOOK_NOT_FOUND });
        }

        res.status(200).json({ message: 'Книга успішно видалена' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};