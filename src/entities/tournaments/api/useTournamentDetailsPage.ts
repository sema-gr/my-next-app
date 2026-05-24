import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user.store';
import {
    getTournamentStatus,
    useTournamentDetails,
} from '@/entities/tournaments';
import { api } from '@/shared/api';
import { toast } from 'sonner';

export function useTournamentDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const { user } = useUserStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('info');

    const { tournament, loading, error, refetch } = useTournamentDetails(
        params.id as string
    );

    const isOrganizer = user?.id === tournament?.organizerId;

    const status = tournament ? getTournamentStatus(tournament.status) : null;

    const teamsList = useMemo(() => {
        if (!tournament) return [];

        return tournament.registrations
            .filter((reg) => reg.status === 'APPROVED')
            .map((reg) => ({
                id: reg.team.id,
                name: reg.team.name,
            }));
    }, [tournament]);

    const handleStartTournament = () => {
        if (!tournament) return;

        const token = localStorage.getItem('token');

        toast.warning('Розпочати турнір?', {
            description:
                'Реєстрацію буде закрито, а сітку згенеровано автоматично.',

            action: {
                label: 'Підтвердити',

                onClick: async () => {
                    try {
                        await api.patch(
                            `/tournaments/${tournament.id}/start`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        toast.success('Турнір успішно розпочато!');

                        refetch();
                    } catch (error: any) {
                        toast.error(
                            error.message || 'Помилка при старті турніру'
                        );
                    }
                },
            },
        });
    };

    const handleScoreUpdate = async (
        matchId: string,
        scoreA: number,
        scoreB: number
    ) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(
                `/tournaments/matches/${matchId}/score`,
                {
                    scoreA,
                    scoreB,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            refetch();
        } catch {
            toast('Помилка збереження результату');
        }
    };

    const handleDeleteTournament = async () => {
        toast(
            'Ви впевнені, що хочете видалити цей турнір? Всі дані будуть втрачені!',
            {
                action: {
                    label: 'Видалити',
                    onClick: async () => {
                        try {
                            await api.delete(`/tournaments/${tournament!.id}`);

                            toast.success('Турнір успішно видалено');

                            router.push('/dashboard?tab=tournaments');
                        } catch (error: any) {
                            toast.error(
                                error.message || 'Помилка видалення турніру'
                            );
                        }
                    },
                },
            }
        );
    };

    const handleLeaveTournament = async () => {
        const myRegistration = tournament!.registrations.find(
            (reg) => reg.team.ownerId === user?.id
        );

        if (!myRegistration) return;

        toast('Ви впевнені, що хочете зняти свою команду з турніру?', {
            action: {
                label: 'Підтвердити',
                onClick: async () => {
                    try {
                        await api.delete(
                            `/tournaments/${tournament!.id}/leave/${myRegistration.team.id}`
                        );

                        toast.success('Команду знято з турніру');

                        refetch();
                    } catch (error: any) {
                        toast.error(error.message || 'Помилка');
                    }
                },
            },
        });
    };

    return {
        router,
        user,

        loading,
        error,
        tournament,

        status,
        isOrganizer,
        teamsList,

        isModalOpen,
        setIsModalOpen,

        selectedTab,
        setSelectedTab,

        handleScoreUpdate,
        handleStartTournament,
        refetch,

        handleLeaveTournament,
        handleDeleteTournament,
    };
}
