import { useEffect, useState, useCallback } from 'react';
import { api } from '@/shared/api';
import { ITournament } from '@/entities/tournaments';

export function useTournamentDetails(id?: string) {
    const [tournament, setTournament] = useState<ITournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const refetch = useCallback(() => {
        if (!id) return;

        setLoading(true);
        setError('');

        api.get<ITournament>(`/tournaments/${id}`)
            .then(setTournament)
            .catch((err) => {
                console.error(err);
                setError('Турнір не знайдено або сталася помилка.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        tournament,
        loading,
        error,
        refetch,
    };
}
