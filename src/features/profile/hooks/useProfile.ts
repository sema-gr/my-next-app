import { useMemo } from 'react';
import { useUserStore } from '@/app/store/user.store';

export function useProfile() {
    const { user, loading } = useUserStore();

    const stats = useMemo(() => {
        if (!user) return null;

        const base = user.stats || { gamesPlayed: 0, wins: 0 };
        const losses = base.gamesPlayed - base.wins;
        const winRate =
            base.gamesPlayed > 0
                ? ((base.wins / base.gamesPlayed) * 100).toFixed(1)
                : '0';

        return {
            ...base,
            losses,
            winRate,
        };
    }, [user]);

    return {
        user,
        loading,
        stats,
    };
}
