import { TeamCard } from '@/entities/teams';
import { ListGrid } from '@/shared/ui';
import { useTeams } from '@/features/teams';

export function TeamsList() {
    const { data, loading } = useTeams();

    return (
        <ListGrid
            items={data}
            loading={loading}
            emptyText="Немає команд"
            renderItem={(team) => <TeamCard key={team.id} team={team} />}
        />
    );
}
