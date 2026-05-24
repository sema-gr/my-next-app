import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/shared/api';
import { toast } from 'sonner';

export function useCreateTeam() {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const createTeam = async () => {
        if (!name.trim()) {
            setError('Назва команди не може бути порожньою');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const token = localStorage.getItem('token');

            await api.post(
                '/teams',
                { name: name.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Команду успішно створено! 🏆');
            router.push('/profile');
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Сталася помилка при створенні команди');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        name,
        setName,
        submitting,
        error,
        createTeam,
    };
}
