import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/shared/api';
import { toast } from 'sonner';
import { ISelectCategory, CreateTournamentInput } from '@/entities/tournaments';

export function useCreateTournament() {
    const [categories, setCategories] = useState<ISelectCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get<ISelectCategory[]>('/categories')
            .then(setCategories)
            .catch(() => toast.error('Не вдалося завантажити категорії'))
            .finally(() => setIsLoading(false));
    }, []);

    const onSubmit = async (data: CreateTournamentInput) => {
        try {
            const token = localStorage.getItem('token');

            const payload = {
                title: data.title,
                categoryId: data.categoryId,
                maxTeams: Number(data.maxTeams),
                startDate: new Date(data.startDate).toISOString(),
                description: data.description || undefined,
            };

            await api.post('/tournaments', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Турнір успішно створено! 🏆');
            router.push('/profile');
        } catch (error: any) {
            console.error(error);
            toast.error('Помилка створення турніру');
        }
    };

    return {
        categories,
        isLoading,
        onSubmit,
    };
}
