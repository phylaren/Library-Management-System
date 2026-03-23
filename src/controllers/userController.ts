import { Request, Response } from "express";
import { UserService } from "../services/userService"; 
import { createUserSchema } from "../schemas/validation"; 
import { ErrorMessages } from '../schemas/errors'; 

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
            return res.status(400).json({ error: error.errors });
        }
        
        res.status(500).json({ error: error.message });
    }
};