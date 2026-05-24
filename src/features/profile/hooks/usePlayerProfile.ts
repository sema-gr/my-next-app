import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { IPlayerStats, IProfile } from '@/entities/user';

export function usePlayerProfile(userId: string | undefined) {
    const [user, setUser] = useState<IProfile['profile'] | null>(null);
    const [fullProfile, setFullProfile] = useState<IProfile | null>(null);
    const [stats, setStats] = useState<
        (IPlayerStats & { winRate: number; losses: number }) | null
    >(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await api.get<IProfile>(
                    `/users/${userId}/career`
                );

                setFullProfile(response);

                setUser(response.profile);

                const s = response.statistics || {
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                };

                const winRate =
                    s.gamesPlayed > 0
                        ? Math.round((s.wins / s.gamesPlayed) * 100)
                        : 0;

                setStats({ ...s, winRate, losses: s.losses || 0 });
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                        'Помилка завантаження профілю'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    return { user, stats, fullProfile, loading, error };
}
