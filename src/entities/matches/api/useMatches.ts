import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { IMatch } from '@/entities/matches';

export function useMatches() {
    const [data, setData] = useState<IMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await api.get<IMatch[]>('/matches');
                setData(response);
            } catch (error) {
                console.error('Помилка при завантаженні матчів:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    return { data, loading };
}
