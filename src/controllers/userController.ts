import { Request, Response } from "express";
import { UserService } from "../services/userService"; 
import { createUserSchema } from "../schemas/validation"; 
import { ErrorMessages } from '../schemas/errors'; 
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../db/prisma'; 
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

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

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: '# Не авторизовано' });
        if (!req.file) return res.status(400).json({ error: '# Файл не надано' });

        const userId = req.user.userId;
        
        const filename = `${uuidv4()}.webp`;
        const outputPath = path.join(process.cwd(), 'uploads', 'avatars', filename);

        await sharp(req.file.buffer)
            .resize(250, 250, { fit: 'cover', position: 'center' })
            .webp({ quality: 80 })
            .toFile(outputPath);

        const newAvatarUrl = `/uploads/avatars/${filename}`;

        const user = await userService.getById(userId);
        
        if (user && user.avatarUrl) {
            const oldFileName = path.basename(user.avatarUrl);
            const oldFilePath = path.join(process.cwd(), 'uploads', 'avatars', oldFileName);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await userService.update(userId, { avatarUrl: newAvatarUrl });

        res.json({ 
            message: "Аватарку успішно оптимізовано та оновлено.",
            avatarUrl: newAvatarUrl
        });
    } catch (error: any) {
        res.status(500).json({ error: `# Помилка завантаження: ${error.message}` });
    }
};

export const deleteAvatar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: '# Не авторизовано' });
        
        const userId = req.user.userId;
        const user = await userService.getById(userId);

        if (!user || !user.avatarUrl) {
            return res.status(404).json({ error: '# Аватарку не знайдено' });
        }

        const filePath = path.join(process.cwd(), 'uploads', 'avatars', path.basename(user.avatarUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await userService.update(userId, { avatarUrl: null });

        res.json({ message: "Аватарку видалено." });
    } catch (error: any) {
        res.status(500).json({ error: `# Внутрішня помилка сервера: ${error.message}` });
    }
};