'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user.store';
import {
    ArrowLeft,
    Crown,
    Activity,
    ShieldAlert,
    UserPlus,
    Calendar,
    Skull,
    Trophy,
    Target,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui';
import {
    InvitePlayerModal,
    useJoinTeams,
    useTeamDetails,
} from '@/features/teams';
import { TeamApplications } from '@/features/teams/ui/TeamApplications';
import { ManageJoinRequests } from '@/features/teams';
import Link from 'next/link';

export function TeamsDetailsPage() {
    const params = useParams();
    const { user } = useUserStore();
    const router = useRouter();

    const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
    const { team, loading, error, refetch } = useTeamDetails(teamId);

    const isCaptain = user?.id === team?.ownerId;
    const memberIds = team?.members.map((m) => m.user.id);
    const isMember = memberIds?.includes(user?.id || '');
    const isAdmin = user?.role === 'ADMIN';

    const {
        handleJoinTeam,
        isJoining,
        handleDisbandTeam,
        handleLeaveTeam,
        myInviteId,
        handleRespondToInvite,
    } = useJoinTeams(teamId!, isMember!, isCaptain, refetch);

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('info');

    const allMatches = team
        ? [...(team.matchesA || []), ...(team.matchesB || [])]
        : [];
    const totalMatches = allMatches.length;
    const wins = allMatches.filter(
        (match) => match.winnerId === team?.id
    ).length;
    const losses = allMatches.filter(
        (match) =>
            match.status === 'FINISHED' &&
            match.winnerId &&
            match.winnerId !== team?.id
    ).length;
    const winrate =
        totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <ShieldAlert className="w-16 h-16 text-slate-300" />
                <p className="text-slate-500 font-bold">
                    {error || 'Команду не знайдено'}
                </p>
                <button onClick={() => router.back()}>Повернутися назад</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 relative">
            <div>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors -ml-2 p-2 rounded-lg hover:bg-slate-50"
                >
                    <ArrowLeft className="w-4 h-4" /> Назад
                </button>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 max-sm:p-4">
                <div className="flex items-center gap-6 max-sm:gap-3">
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg transform -rotate-3">
                        {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                            {team.name}
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-500" />{' '}
                            Капітан: {team.owner.name}
                        </p>
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3 flex-col">
                    {isCaptain && (
                        <button
                            onClick={() => setIsInviteOpen(true)}
                            className="flex-1 md:flex-none bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" /> Запросити
                        </button>
                    )}

                    {myInviteId ? (
                        <div className="flex w-full md:w-auto gap-3 flex-col sm:flex-row">
                            <button
                                onClick={() =>
                                    handleRespondToInvite('ACCEPTED')
                                }
                                className="flex-1 md:flex-none bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Прийняти запрошення
                            </button>
                            <button
                                onClick={() =>
                                    handleRespondToInvite('REJECTED')
                                }
                                className="flex-1 bg-white text-slate-600 font-bold px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors"
                            >
                                Відхилити
                            </button>
                        </div>
                    ) : (
                        user &&
                        !isAdmin &&
                        !isCaptain &&
                        !isMember && (
                            <button
                                onClick={handleJoinTeam}
                                disabled={isJoining}
                                className="flex-1 md:flex-none bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                            >
                                <UserPlus className="w-5 h-5" />
                                {isJoining ? 'Відправка...' : 'Приєднатися'}
                            </button>
                        )
                    )}

                    {user?.id === team.ownerId ? (
                        <button
                            onClick={handleDisbandTeam}
                            className="w-full bg-white border-2 border-red-500 text-red-500 font-bold text-lg px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            Розпустити команду
                        </button>
                    ) : (
                        team.members.some((m) => m.user.id === user?.id) && (
                            <button
                                onClick={handleLeaveTeam}
                                className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                Покинути команду
                            </button>
                        )
                    )}
                </div>
            </div>

            <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
            >
                <TabsList className="mb-6 bg-white border border-slate-200 p-1 rounded-xl shadow-sm flex justify-start w-full max-w-full overflow-x-auto sm:inline-flex sm:w-auto gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsTrigger
                        value="info"
                        className="rounded-lg font-bold px-4 sm:px-6 whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                    >
                        Склад та Інформація
                    </TabsTrigger>

                    {isCaptain && (
                        <>
                            <TabsTrigger
                                value="applications"
                                className="rounded-lg font-bold px-4 sm:px-6 whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                            >
                                Заявки на турніри
                            </TabsTrigger>
                            <TabsTrigger
                                value="requests"
                                className="rounded-lg font-bold px-4 sm:px-6 whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                            >
                                Вхідні запити
                            </TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="info" className="mt-0 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {team.members.map((member) => {
                                    const isMemberCaptain =
                                        member.user.id === team.ownerId;

                                    const isMe = member.user.id === user?.id;

                                    const stats = member.user.stats || {
                                        gamesPlayed: 0,
                                        wins: 0,
                                    };

                                    return (
                                        <Link
                                            href={
                                                isMe
                                                    ? '/profile'
                                                    : `/profile/${member.user.id}`
                                            }
                                            key={member.id}
                                            className={`group bg-white p-5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer
                                                'border-slate-100 hover:border-slate-900 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'} hover:-translate-y-1
                                            `}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-colors 
                                                    ${isMemberCaptain ? 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'}
                                                `}
                                            >
                                                {member.user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 flex items-center gap-2 transition-colors">
                                                    {member.user.name}
                                                </h4>
                                                <p className="text-[12px] text-slate-400 font-bold tracking-wider mt-0.5">
                                                    @{member.user.username}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                    {stats.wins}W -
                                                    {stats.gamesPlayed -
                                                        stats.wins}
                                                    L
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                Статистика команди
                            </h3>

                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-6 shadow-sm">
                                <div className="flex items-center justify-between pb-6 border-b border-slate-200/60">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Відсоток перемог
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Target
                                                className={`w-5 h-5 ${winrate >= 50 ? 'text-green-500' : 'text-slate-400'}`}
                                            />
                                            <p className="text-3xl font-black text-slate-900">
                                                {winrate}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Всього матчів
                                        </p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="text-3xl font-black text-slate-900">
                                                {totalMatches}
                                            </p>
                                            <Activity className="w-5 h-5 text-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                            Перемоги
                                        </p>
                                        <p className="text-xl font-black text-slate-900">
                                            {wins}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <Skull className="w-3.5 h-3.5 text-red-400" />
                                            Поразки
                                        </p>
                                        <p className="text-xl font-black text-slate-900">
                                            {losses}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex items-center justify-between bg-slate-100/50 px-4 py-3 rounded-xl border border-slate-200/50">
                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            Створено
                                        </p>
                                        <p className="text-sm font-black text-slate-700">
                                            {new Date(
                                                team.createdAt
                                            ).toLocaleDateString('uk-UA')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {isCaptain && (
                    <TabsContent value="applications" className="mt-0">
                        <TeamApplications teamId={team.id} />
                    </TabsContent>
                )}

                {isCaptain && (
                    <TabsContent value="requests" className="mt-0">
                        <ManageJoinRequests teamId={team.id} />
                    </TabsContent>
                )}
            </Tabs>

            {memberIds && (
                <InvitePlayerModal
                    teamId={team.id}
                    isOpen={isInviteOpen}
                    onClose={() => setIsInviteOpen(false)}
                    onSuccess={refetch}
                    existingMemberIds={memberIds}
                />
            )}
        </div>
    );
}
