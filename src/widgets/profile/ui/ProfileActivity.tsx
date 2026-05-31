'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/shared/api';
import { Trophy, Users, Crown } from 'lucide-react';
import { IUser } from '@/entities/user';
import { ITournament } from '@/entities/tournaments';
import { ITeam } from '@/entities/teams';

interface ProfileActivityProps {
    user: IUser;
}

export function ProfileActivity({ user }: ProfileActivityProps) {
    const [tournaments, setTournaments] = useState<ITournament[]>([]);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);

        if (user.role === 'ORGANIZER') {
            api.get(`/tournaments?organizerId=${user.id}`)
                .then((res) => {
                    // Безпечне розпакування пагінованої відповіді
                    const payload =
                        (res as any).data?.data !== undefined
                            ? (res as any).data
                            : res;
                    setTournaments(payload.data || payload || []);
                })
                .catch((err) =>
                    console.error('Помилка завантаження турнірів:', err)
                )
                .finally(() => setLoading(false));
        } else if (user.role === 'PLAYER') {
            const token = localStorage.getItem('token');
            api.get('/teams/my-teams', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    // Безпечне розпакування для команд
                    const payload =
                        (res as any).data?.data !== undefined
                            ? (res as any).data
                            : res;
                    setTeams(payload.data || payload || []);
                })
                .catch((err) =>
                    console.error('Помилка завантаження команд:', err)
                )
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user.id, user.role]);

    return (
        <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                {user.role === 'ORGANIZER' ? 'Мої турніри' : 'Активні команди'}
            </h3>

            {loading ? (
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-10 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" />
                </div>
            ) : user.role === 'ORGANIZER' && tournaments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {tournaments.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => router.push(`/tournaments/${t.id}`)}
                            className="group p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-900 transition-all cursor-pointer flex justify-between items-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                                    <Trophy className="w-5 h-5 text-slate-300 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">
                                        {t.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                        {t.category?.name} • {t.maxTeams} команд
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black px-2 py-1 bg-green-50 text-green-600 rounded-md uppercase">
                                    {t.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : user.role === 'PLAYER' && teams.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            onClick={() => router.push(`/teams/${team.id}`)}
                            className="group p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-900 transition-all cursor-pointer flex justify-between items-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white transform -rotate-3 group-hover:rotate-0 transition-transform shadow-md">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">
                                        {team.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                                            <Users className="w-3 h-3" />{' '}
                                            {team._count?.members || 1} гравців
                                        </span>
                                        {team.ownerId === user.id && (
                                            <span className="text-[10px] font-black px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1 uppercase tracking-wider">
                                                <Crown className="w-3 h-3" />{' '}
                                                Капітан
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                                    Деталі &rarr;
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-10 text-center border-dashed">
                    <p className="text-slate-400 text-sm">
                        {user.role === 'ORGANIZER'
                            ? 'Ви ще не організували жодного турніру'
                            : 'Ви поки не є учасником жодної команди'}
                    </p>
                </div>
            )}
        </div>
    );
}
