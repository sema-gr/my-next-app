'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, Plus } from 'lucide-react';
import { Card, CardContent, Header } from '@/shared/ui';
import { useUserStore } from '@/app/store/user.store';
import { ApprovalModal } from '@/widgets/approvalModel';
import { useOrganizerApproval } from '@/features/admin';

export function HomePage() {
    const { user, fetchUser, loading, setUser } = useUserStore();
    const router = useRouter();

    const {
        isApprovalModalOpen,
        setIsApprovalModalOpen,
        isRejected,
        isSubmitting,
        handleCreateTournamentClick,
        handleResubmitRequest,
    } = useOrganizerApproval();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="p-6 max-w-7xl mx-auto space-y-6">
                {!loading && user && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Вітаємо, {user.name}! 👋
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Готові до нових перемог? Оберіть потрібний
                                розділ нижче або почніть нову активність.
                            </p>
                        </div>

                        {user.role === 'PLAYER' && (
                            <Link
                                href="/teams/create"
                                className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-md whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" /> Створити команду
                            </Link>
                        )}

                        {user.role === 'ORGANIZER' && (
                            <button
                                onClick={() => handleCreateTournamentClick()}
                                className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-md whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" /> Створити турнір
                            </button>
                        )}
                    </div>
                )}

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                    <Link
                        href="/dashboard?tab=teams"
                        className="block h-full group"
                    >
                        <Card className="rounded-2xl shadow-sm border-gray-200 group-hover:shadow-md group-hover:border-slate-900 transition-all h-full">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <Users className="h-6 w-6 text-blue-600 group-hover:text-white" />
                                </div>
                                <h2 className="mb-2 text-xl font-bold text-gray-900">
                                    Команди
                                </h2>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Створення команд, керування складом та
                                    запрошення учасників.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link
                        href="/dashboard?tab=tournaments"
                        className="block h-full group"
                    >
                        <Card className="rounded-2xl shadow-sm border-gray-200 group-hover:shadow-md group-hover:border-slate-900 transition-all h-full">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="p-3 bg-green-50 w-fit rounded-xl mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <Calendar className="h-6 w-6 text-green-600 group-hover:text-white" />
                                </div>
                                <h2 className="mb-2 text-xl font-bold text-gray-900">
                                    Змагання
                                </h2>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Планування матчів, формування турнірних
                                    сіток та розкладів.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link
                        href="/dashboard?tab=matches"
                        className="block h-full group"
                    >
                        <Card className="rounded-2xl shadow-sm border-gray-200 group-hover:shadow-md group-hover:border-slate-900 transition-all h-full">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="p-3 bg-orange-50 w-fit rounded-xl mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <Trophy className="h-6 w-6 text-orange-600 group-hover:text-white" />
                                </div>
                                <h2 className="mb-2 text-xl font-bold text-gray-900">
                                    Результати
                                </h2>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Перегляд результатів матчів, рейтингів і
                                    статистики команд.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </section>
            </main>

            <ApprovalModal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                isRejected={isRejected}
                onResubmit={handleResubmitRequest}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
