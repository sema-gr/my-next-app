import { useEffect, useState, useCallback } from 'react';
import { api } from '@/shared/api';
import { ITeamDetails } from '@/entities/teams';

export function useTeamDetails(teamId?: string) {
    const [team, setTeam] = useState<ITeamDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTeam = useCallback(async () => {
        if (!teamId) return;

        try {
            setTeam((prev) => (prev ? prev : null)); 
            
            const res = await api.get<ITeamDetails>(`/teams/${teamId}?t=${Date.now()}`);
            setTeam(res);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Команду не знайдено або сталася помилка.');
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    return {
        team,
        loading,
        error,
        refetch: fetchTeam,
    };
}