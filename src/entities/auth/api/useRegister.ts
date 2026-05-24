'use client';

import { toast } from 'sonner';
import { RegisterFormData } from '@/entities/auth';
import { useRouter } from 'next/navigation';
import { AuthResponse } from '@/shared/models';
import { api } from '@/shared/api';

export function useRegister() {
    const router = useRouter();

    const registerUser = async (data: RegisterFormData) => {
        try {
            const res = await api.post<AuthResponse>('/auth/register', data);
            localStorage.setItem('token', res.data.token);
            toast.success('Акаунт створено 🎉');
            router.push('/');
        } catch (error: any) {
            toast.error(error.message || 'Помилка реєстрації');
        }
    };

    return { registerUser };
}
