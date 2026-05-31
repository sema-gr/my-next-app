'use client';

import {
    ArrowLeft,
    Trophy,
    Calendar,
    Users,
    ShieldCheck,
    Activity,
} from 'lucide-react';
import {
    useTournamentDetailsPage,
} from '@/entities/tournaments';
import {
    InfoCard,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/shared/ui';
import {
    ApplyTournamentModal,
    ManageApplications,
    TournamentBracket,
} from '@/features/tournaments';

export function TournamentDetailsPage() {
    const {
        router,
        user,
        tournament,
        loading,
        error,
        status,
        isOrganizer,
        teamsList,
        isModalOpen,
        setIsModalOpen,
        selectedTab,
        setSelectedTab,
        handleScoreUpdate,
        refetch,
        handleStartTournament,
        handleDeleteTournament,
        handleLeaveTournament,
    } = useTournamentDetailsPage();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    if (error || !tournament) {
        return (
            <div className="max-w-3xl mx-auto p-10 text-center space-y-6">
                <p className="text-slate-500 font-bold">
                    {error || 'Турнір не знайдено'}
                </p>
                <button
                    onClick={() => router.back()}
                    className="text-slate-900 font-bold underline hover:text-slate-600"
                >
                    Повернутися назад
                </button>
            </div>
        );
    }

    const isPlayer = user?.role === 'PLAYER' && !isOrganizer;

    const isRegistered = tournament.registrations?.some(
        (reg) => reg.team.ownerId === user?.id
    );

    const isOpenForRegistration =
        tournament.status !== 'ACTIVE' && tournament.status !== 'FINISHED';

    const tournamentInfoContent = (
        <>
            <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider ${status!.color}`}
                            >
                                {status!.label}
                            </span>

                            <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider">
                                {tournament.category.name}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                            {tournament.title}
                        </h1>

                        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                            {tournament.description ||
                                'Організатор не додав опис.'}
                        </p>
                    </div>

                    {isOrganizer && (
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {(tournament.status === 'PLANNED' ||
                                tournament.status === 'REGISTRATION') && (
                                <button
                                    onClick={handleStartTournament}
                                    className="w-full md:w-auto bg-slate-900 text-white font-bold text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform whitespace-nowrap"
                                >
                                    Розпочати турнір
                                </button>
                            )}

                            {tournament.status !== 'ACTIVE' && (
                                <button
                                    onClick={handleDeleteTournament}
                                    className="w-full bg-white border-2 border-red-500 text-red-500 font-bold text-lg px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    Видалити турнір
                                </button>
                            )}
                        </div>
                    )}

                    {isPlayer && (
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {isRegistered ? (
                                isOpenForRegistration ? (
                                    <button
                                        onClick={handleLeaveTournament}
                                        className="w-full bg-white border-2 border-slate-300 text-slate-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors"
                                    >
                                        Скасувати участь
                                    </button>
                                ) : (
                                    <div className="w-full px-8 py-4 bg-green-50 border-2 border-green-200 text-green-700 font-bold text-lg rounded-xl text-center">
                                        Ваша команда у грі
                                    </div>
                                )
                            ) :
                            isOpenForRegistration ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-slate-900 text-white font-bold text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                                >
                                    Подати заявку
                                </button>
                            ) : (
                                <div className="w-full px-8 py-4 bg-slate-100 border-2 border-slate-200 text-slate-500 font-bold text-lg rounded-xl text-center">
                                    Реєстрацію закрито
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {(tournament.status === 'ACTIVE' ||
                tournament.status === 'FINISHED') && (
                <div className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">
                        Турнірна Сітка
                    </h2>

                    <TournamentBracket
                        matches={tournament.matches}
                        teams={teamsList}
                        isOrganizer={isOrganizer}
                        onMatchUpdate={handleScoreUpdate}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        Характеристики
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard
                            icon={<Calendar />}
                            label="Дата початку"
                            value={new Date(
                                tournament.startDate
                            ).toLocaleDateString('uk-UA')}
                        />

                        <InfoCard
                            icon={<Users />}
                            label="Команди"
                            value={`${tournament._count?.registrations || 0} / ${tournament.maxTeams}`}
                        />

                        <InfoCard
                            icon={<Activity />}
                            label="Формат"
                            value={
                                tournament.format === 'SINGLE_ELIMINATION'
                                    ? 'Play-off'
                                    : 'Круговий'
                            }
                        />

                        <InfoCard
                            icon={<Trophy />}
                            label="Дисципліна"
                            value={tournament.category.name}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        Організатор
                    </h3>

                    <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {tournament?.organizer?.organizationName ||
                                    tournament?.organizer?.name ||
                                    'Організатор невідомий'}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                                {tournament?.organizer?.organizationName
                                    ? 'Офіційна організація'
                                    : 'Верифікований користувач'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 relative">
                <button
                    onClick={() => router.push('/dashboard?tab=tournaments')}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors -ml-2 p-2 rounded-lg hover:bg-slate-50"
                >
                    <ArrowLeft className="w-4 h-4" /> До списку
                </button>

                {isOrganizer ? (
                    <Tabs
                        value={selectedTab}
                        onValueChange={setSelectedTab}
                        className="w-full"
                    >
                        <TabsList className="mb-6 bg-white border border-slate-200 p-1 rounded-xl shadow-sm inline-flex">
                            <TabsTrigger
                                value="info"
                                className="rounded-lg font-bold px-6"
                            >
                                Інформація
                            </TabsTrigger>
                            <TabsTrigger
                                value="applications"
                                className="rounded-lg font-bold px-6"
                            >
                                Заявки на участь
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="mt-0 space-y-8">
                            {tournamentInfoContent}
                        </TabsContent>

                        <TabsContent value="applications" className="mt-0">
                            <ManageApplications
                                tournamentId={tournament.id}
                                maxTeams={tournament.maxTeams}
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="space-y-8">{tournamentInfoContent}</div>
                )}
            </div>

            <ApplyTournamentModal
                tournamentId={tournament.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => refetch && refetch()}
            />
        </>
    );
}
