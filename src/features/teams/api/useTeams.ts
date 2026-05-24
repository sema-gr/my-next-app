import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { ITeam } from '@/entities/teams';

export function useTeams() {
    const [data, setData] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        api.get<ITeam[]>('/teams')
            .then(setData)
            .catch((err) => {
                console.error('Помилка завантаження команд:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}