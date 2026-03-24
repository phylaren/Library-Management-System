import { Request, Response } from "express";
import { UserService } from "../services/userService"; 
import { createUserSchema } from "../schemas/validation"; 
import { ErrorMessages } from '../schemas/errors'; 
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../db/prisma'; 

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: '# Не авторизовано' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: '# Користувача не знайдено' });
        }

        res.json(user);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
    const users = await userService.getAll(); 
    res.json(users); 
};

export const getUserByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userService.getById(id as string);
        
        if (!user) {
            return res.status(404).json({ error: ErrorMessages.USER_NOT_FOUND });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const validatedData = createUserSchema.parse(req.body);
        
        const user = await userService.create(validatedData);
        
        res.status(201).json(user);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
};