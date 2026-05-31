'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { api } from '@/shared/api';
import { useAuthStore } from '@/entities/auth';

interface VerifyResponse {
    status: string;
    message: string;
}

export function useVerifyEmail() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const clearRegistrationEmail = useAuthStore(
        (state) => state.clearRegistrationEmail
    );

    const verifyCode = async (email: string | null, code: string) => {
        if (!email) {
            toast.error(
                'Електронну пошту не знайдено. Спробуйте зареєструватися знову.'
            );
            return;
        }

        if (code.length !== 6) {
            toast.error('Код має містити 6 цифр');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post<VerifyResponse>('/auth/verify-code', {
                email,
                code,
            });

            setIsSuccess(true);
            toast.success(res.message || 'Пошту успішно підтверджено! 🎉');

            clearRegistrationEmail();

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setIsSuccess(false);
            toast.error(error.message || 'Невірний код або час його дії минув');
        } finally {
            setIsLoading(false);
        }
    };

    return { verifyCode, isLoading, isSuccess };
}
