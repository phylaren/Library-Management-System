import { prisma } from '../db/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import crypto from 'crypto';
import { sendMail } from '../utils/sendMail';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export class AuthService {

  async register(data: any) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      throw new Error('# Користувач з таким email вже існує');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: passwordHash 
      }
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
  }

  async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('# Неправильний email або пароль');

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) throw new Error('# Неправильний email або пароль');

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '15m' } 
    );

    const refreshToken = jwt.sign(
      { userId: user.id }, 
      JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async refresh(oldRefreshToken: string) {
    try {
      const decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user || user.refreshToken !== oldRefreshToken) { 
        throw new Error('# Невалідний рефреш токен');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('# Невалідний рефреш токен');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return true; 

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    const emailText = `
      Привіт, ${user.name}!
      Ти запросив скидання пароля.
      
      Ось твій токен для скидання: ${resetToken}
      
      Він дійсний лише 15 хвилин. Якщо це був не ти, просто проігноруй цей лист.
    `;

    await sendMail(user.email, 'Скидання пароля - Library System', emailText);
    
    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { resetToken: token }
    });

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new Error('Invalid or expired token');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return true;
  }
}