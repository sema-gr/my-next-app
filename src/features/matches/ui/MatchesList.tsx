'use client';

import { MatchCard, useMatches } from '@/entities/matches';
import { ListGrid } from '@/shared/ui';

export function MatchesList() {
    const { data, loading } = useMatches();

    return (
        <ListGrid
            items={data}
            loading={loading}
            emptyText="Немає запланованих матчів"
            renderItem={(match) => <MatchCard key={match.id} match={match} />}
        />
    );
}
