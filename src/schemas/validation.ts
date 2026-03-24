import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, "# Введіть назву книги"),
  author: z.string().min(1, "# Введіть автора книги"),
  year: z.number().int().min(1000).max(new Date().getFullYear()),
  isbn: z.string().min(10, "# Змінить формат ISBN"),
});

export const updateBookSchema = createBookSchema.partial();

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const createLoanSchema = z.object({
  userId: z.string().uuid().optional(),
  bookId: z.string().uuid(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "# Ім'я має містити мінімум 2 символи"),
  email: z.string().email("# Невірний формат email"),
  password: z.string().min(8, "# Пароль має містити мінімум 8 символів")
});

export const loginSchema = z.object({
  email: z.string().email("# Невірний формат email"),
  password: z.string().min(1, "# Пароль є обов'язковим")
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "# Введіть рефреш токен")
});