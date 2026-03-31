import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema, requestResetSchema, resetPasswordSchema } from '../schemas/validation';
import { refreshTokenSchema } from '../schemas/validation';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.register(validatedData);
    
    res.status(201).json(user);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.issues });
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.issues });
    }
    res.status(401).json({ error: error.message }); 
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    
    const result = await authService.refresh(validatedData.refreshToken);
    
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.issues });
    }
    
    res.status(401).json({ error: error.message });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const validatedData = requestResetSchema.parse(req.body);
    
    await authService.requestPasswordReset(validatedData.email);
    res.json({ message: "Якщо вказаний email зареєстрований, лист з інструкціями надіслано" });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: `# Помилка сервера: ${error.message}` });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    
    await authService.resetPassword(validatedData.token, validatedData.password);
    
    res.json({ message: "Пароль успішно змінено" });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Invalid or expired token') {
      return res.status(400).json({ error: '# Недійсний або протермінований токен' });
    }
    res.status(500).json({ error: `# Помилка сервера: ${error.message}` });
  }
};