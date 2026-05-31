'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RegisterFormData, RegisterResponse } from '@/entities/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/shared/api';
import { useAuthStore } from '../models/store';

export function useRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const setRegistrationEmail = useAuthStore(
        (state) => state.setRegistrationEmail
    );

    const registerUser = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const res = await api.post<RegisterResponse>(
                '/auth/register',
                data
            );

            toast.success(res.message || 'Код надіслано! Перевірте пошту. 📧');
            setRegistrationEmail(data.email);
            router.push('/verify-email');
        } catch (error: any) {
            toast.error(error.message || 'Помилка реєстрації');
        } finally {
            setIsLoading(false);
        }
    };

    return { registerUser, isLoading };
}
