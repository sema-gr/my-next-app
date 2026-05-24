'use client';

import { useParams, useRouter } from 'next/navigation';
import { StatBox } from '@/shared/ui';
import { usePlayerProfile } from '@/features/profile';
import Link from 'next/link'; // Додав для навігації по командах
import {
    Trophy,
    ShieldCheck,
    Activity,
    Hash,
    Calendar,
    CircleX,
    ArrowLeft,
    UserX,
    Users,
    History,
} from 'lucide-react';

export function UserProfilePage() {
    const params = useParams();
    const router = useRouter();

    const userId = Array.isArray(params.id) ? params.id[0] : params.id;
    const { user, fullProfile, loading, stats, error } =
        usePlayerProfile(userId);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <UserX className="w-16 h-16 text-slate-300" />
                <p className="text-slate-500 font-bold text-lg">
                    {error || 'Користувача не знайдено'}
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    Повернутися назад
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-6 animate-in fade-in duration-700">
            <div>
                <button
                    onClick={() => {
                        const teamId = fullProfile?.teams?.[0]?.id;
                        router.push(teamId ? `/teams/${teamId}` : '/teams');
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors -ml-2 p-2 rounded-lg hover:bg-slate-50"
                >
                    <ArrowLeft className="w-4 h-4" /> Назад
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 shrink-0 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-2xl transform -rotate-3">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {user.name}
                        </h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
                                {user.role}
                            </span>
                            <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                                <Hash className="w-3 h-3" />{' '}
                                {user.username || 'user'}
                            </span>
                        </div>
                    </div>
                </div>

                {user.role === 'ORGANIZER' && user.organization && user.isApprovedOrganizer === true && (
                    <div className="w-full md:w-auto bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                            Офіційний представник
                        </p>
                        <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-slate-900" />{' '}
                            {user.organization}
                        </p>
                    </div>
                )}
            </div>

            {user.role !== 'ORGANIZER' && stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatBox
                        title="Матчі"
                        value={stats.gamesPlayed}
                        icon={<Activity />}
                    />
                    <StatBox
                        title="Перемоги"
                        value={stats.wins}
                        icon={<Trophy />}
                    />
                    <StatBox
                        title="Поразки"
                        value={stats.losses}
                        icon={<CircleX />}
                    />
                    <StatBox
                        title="Win Rate"
                        value={`${stats.winRate || 0}%`}
                        highlight
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Акаунт створено
                        </h3>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-sm font-bold text-slate-700">
                                    {fullProfile?.profile?.createdAt
                                        ? new Date(
                                              fullProfile.profile.createdAt
                                          ).toLocaleDateString('uk-UA')
                                        : 'Дані приховано'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {fullProfile?.teams && fullProfile.teams.length > 0 && (
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Команди
                            </h3>
                            <div className="space-y-3">
                                {fullProfile.teams.map((team) => (
                                    <Link
                                        key={team.id}
                                        href={`/teams/${team.id}`}
                                        className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-slate-900 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 text-slate-700 font-black rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                {team.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <p className="font-bold text-slate-900">
                                                {team.name}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                            {team._count.members} ГРАВ.
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            <History className="w-4 h-4" /> Історія Турнірів
                        </h3>

                        {!fullProfile?.history ||
                        fullProfile.history.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                                <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-bold">
                                    Гравець ще не брав участі в турнірах
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {fullProfile.history.map((record, idx) => (
                                    <Link
                                        href={`/tournaments/${record.tournamentId}`}
                                        key={idx}
                                    >
                                        <div
                                            key={idx}
                                            className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        >
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                    {record.category}
                                                </p>
                                                <h4 className="font-black text-slate-900 text-lg">
                                                    {record.tournamentTitle}
                                                </h4>
                                                <p className="text-sm font-bold text-slate-500 mt-1">
                                                    У складі:{' '}
                                                    <span className="text-slate-700">
                                                        {record.teamName}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="shrink-0">
                                                <span
                                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg
                                                ${record.status === 'FINISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}
                                            `}
                                                >
                                                    {record.status ===
                                                    'FINISHED'
                                                        ? 'Завершено'
                                                        : 'Бере участь'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
