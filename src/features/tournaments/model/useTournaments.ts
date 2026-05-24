import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { ITournament } from '@/entities/tournaments';

export function useTournaments() {
    const [data, setData] = useState<ITournament[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get<ITournament[]>('/tournaments')
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}
