import { useEffect, useState } from 'react';
import { IJoinRequest, ITeamRegistration } from '@/features/teams';
import { api } from '@/shared/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user.store';

export function useJoinTeams(
    teamId: string,
    isMember?: boolean,
    isCaptain?: boolean,
    refetch?: () => void
) {
    const { user } = useUserStore();
    const [requests, setRequests] = useState<IJoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [isJoining, setIsJoining] = useState(false);
    const [myInviteId, setMyInviteId] = useState<string | null>(null);

    useEffect(() => {
        if (user && !isMember && !isCaptain) {
            const token = localStorage.getItem('token');
            api.get<any[]>('/teams/invites/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((invites) => {
                    const inviteToThisTeam = invites.find(
                        (inv) => inv.team.id === teamId
                    );
                    if (inviteToThisTeam) {
                        setMyInviteId(inviteToThisTeam.id);
                    }
                })
                .catch(console.error);
        }
    }, [user, isMember, isCaptain, teamId]);

    const handleRespondToInvite = async (status: 'ACCEPTED' | 'REJECTED') => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(
                `/teams/invites/${myInviteId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(
                `Запрошення ${status === 'ACCEPTED' ? 'прийнято!' : 'відхилено'}`
            );
            setMyInviteId(null);
            if (refetch) refetch();
            fetchRequests();
        } catch (error: any) {
            toast.error(error.message || 'Помилка обробки запрошення');
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;
            setError(null);

            const res = await api.get<IJoinRequest[]>(
                `/teams/${teamId}/join-requests`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setRequests(res);
        } catch (err) {
            console.error(err);
            setError('Не вдалося завантажити запити на вступ');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
        requestId: string,
        status: 'APPROVED' | 'REJECTED'
    ) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(
                `/teams/join-requests/${requestId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
            if (status === 'APPROVED' && refetch) refetch();
        } catch (err: any) {
            toast.error(err.message || 'Помилка при зміні статусу');
        }
    };

    const handleJoinTeam = async () => {
        try {
            setIsJoining(true);
            const token = localStorage.getItem('token');
            if (!token) return;
            await api.post<ITeamRegistration>(
                `/teams/${teamId}/join-request`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Заявку на вступ успішно відправлено капітану!');

            if (refetch) refetch();
            fetchRequests();
        } catch (err: any) {
            toast.error(err.message || 'Помилка при відправці заявки');
        } finally {
            setIsJoining(false);
        }
    };

    const executeLeaveTeam = async () => {
        try {
            await api.delete(`/teams/${teamId}/leave`);
            toast.success('Ви успішно покинули команду');
            if (refetch) refetch();
            fetchRequests();
            router.push('/profile');
        } catch (error: any) {
            toast.error(error.message || 'Помилка');
        }
    };

    const handleLeaveTeam = () => {
        toast('Ви впевнені, що хочете покинути цю команду?', {
            duration: 8000,
            action: {
                label: 'Так, покинути',
                onClick: () => executeLeaveTeam(),
            },
            cancel: {
                label: 'Скасувати',
                onClick: () => toast.dismiss(),
            },
        });
    };

    const executeDisbandTeam = async () => {
        try {
            await api.delete(`/teams/${teamId}`);
            toast.success('Команду розпущено');
            router.push('/profile');
        } catch (error: any) {
            toast.error(error.message || 'Помилка видалення');
        }
    };

    const handleDisbandTeam = () => {
        toast.error('ВИ ВПЕВНЕНІ? Команда буде видалена назавжди!', {
            duration: 10000,
            action: {
                label: 'Так, розпустити',
                onClick: () => executeDisbandTeam(),
            },
            cancel: {
                label: 'Скасувати',
                onClick: () => toast.dismiss(),
            },
        });
    };

    useEffect(() => {
        fetchRequests();
    }, [teamId]);

    return {
        requests,
        loading,
        error,
        fetchRequests,
        handleStatusChange,
        isJoining,
        handleJoinTeam,
        router,
        handleDisbandTeam,
        handleLeaveTeam,
        myInviteId,
        handleRespondToInvite,
    };
}
