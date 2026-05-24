import { TournamentCard } from '@/entities/tournaments';
import { useTournaments } from '@/features/tournaments';
import { ListGrid } from '@/shared/ui';

export function TournamentsList() {
    const { data, loading } = useTournaments();

    return (
        <ListGrid
            items={data}
            loading={loading}
            emptyText="Немає турнірів"
            renderItem={(t) => <TournamentCard key={t.id} tournament={t} />}
        />
    );
}
