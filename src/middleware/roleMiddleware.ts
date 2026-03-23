import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const authorizeRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '# Не авторизовано' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: '# Заборонено: недостатні права' }); 
    }

    next();
  };
};