import { IUser } from '@/entities/user';
import { loginSchema, registerSchema } from '@/entities/auth';
import z from 'zod';

export interface AuthResponse {
    status: string;
    data: {
        token: string;
        user: IUser;
    };
}
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
