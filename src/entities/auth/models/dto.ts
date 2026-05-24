import { Role } from '@/entities/user';
import z from 'zod';

export const registerSchema = z
    .object({
        name: z.string().min(2, "Ім'я занадто коротке"),
        email: z.string().email('Некоректний email'),
        password: z.string().min(8, 'Мінімум 8 символів'),
        confirmPassword: z.string(),
        role: z.enum([Role.PLAYER, Role.ORGANIZER] as const, {
            error: 'Некоректна роль',
        }),
        organizationName: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Паролі не співпадають',
        path: ['confirmPassword'],
    })
    .refine(
        (data) => {
            if (data.role === 'ORGANIZER' && !data.organizationName) {
                return false;
            }
            return true;
        },
        {
            message: "Назва організації обов'язкова для організатора",
            path: ['organizationName'],
        }
    );

export const loginSchema = z.object({
    email: z.string().email('Некоректний email'),
    password: z.string().min(8, 'Пароль повинен містити мінімум 8 символів'),
});
