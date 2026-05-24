import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { ITeam } from '@/entities/teams';
import { useUserStore } from '@/app/store/user.store';
import { toast } from 'sonner';

export function useApplyTournament(tournamentId: string, isOpen: boolean) {
    const { user } = useUserStore();

    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen || !user) return;

        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        api.get<ITeam[]>('/teams/my-teams', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const captainTeams = res.filter((t) => t.ownerId === user.id);
                setTeams(captainTeams);
            })
            .catch(() => {
                setError('Не вдалося завантажити команди');
            })
            .finally(() => setLoading(false));
    }, [isOpen, user]);

    const apply = async (
        teamId: string,
        onSuccess: () => void,
        onClose: () => void
    ) => {
        try {
            setSubmittingId(teamId);
            setError('');

            const token = localStorage.getItem('token');

            await api.post(
                `/registrations/${tournamentId}/apply`,
                { teamId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Заявку подано!');
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Помилка подачі заявки');
        } finally {
            setSubmittingId(null);
        }
    };

    return {
        teams,
        loading,
        error,
        submittingId,
        apply,
    };
}
