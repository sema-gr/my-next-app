'use client';
import { api } from '@/shared/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AuthResponse } from '@/shared/models';
import { LoginFormData } from '@/entities/auth';

export function useLogin() {
    const router = useRouter();

    const login = async (data: LoginFormData) => {
        try {
            const res = await api.post<AuthResponse>('/auth/login', data);
            if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
                toast.success('Вхід успішний 🎉');
                router.push('/');
            }
        } catch (error: any) {
            toast.error(error.message || 'Помилка логіну');
        }
    };

    return { login };
}
