'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user.store';
import { Menu, X, Plus, User, LogOut, ShieldCheck } from 'lucide-react';
import { NotificationBell } from '@/features/notifications';
import { ApprovalModal } from '@/widgets/approvalModel';
import { useOrganizerApproval } from '@/features/admin';

export function Header() {
    const { user, setUser } = useUserStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setIsMenuOpen(false);
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:px-8 py-3 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 shrink-0">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-white rotate-45" />
                        </div>
                        <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                            SportTeam{' '}
                            <span className="hidden sm:inline text-slate-400 font-medium">
                                Platform
                            </span>
                        </h1>
                    </div>
                </Link>

                <div className="hidden md:flex gap-4 items-center">
                    {!user ? (
                        <div className="flex gap-3">
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className="text-slate-600 hover:text-slate-900 font-bold"
                                >
                                    Увійти
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 font-bold">
                                    Реєстрація
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {user.role === 'ORGANIZER' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleCreateTournamentClick()
                                    }
                                    className="border-slate-200 text-slate-700 font-bold"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Створити
                                    турнір
                                </Button>
                            )}
                            {user.role === 'ADMIN' && (
                                <Link href="/admin">
                                    <Button
                                        size="sm"
                                        className="bg-slate-900 text-white hover:bg-slate-800 font-bold"
                                    >
                                        <ShieldCheck className="w-4 h-4 mr-2" />{' '}
                                        Адмін-панель
                                    </Button>
                                </Link>
                            )}

                            <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900 leading-none">
                                    {user.name}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-black mt-1 tracking-widest">
                                    {user.role}
                                </p>
                            </div>

                            {user.role !== 'ADMIN' && (
                                <Link href="/profile">
                                    <div className="w-10 h-10 bg-slate-100 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-700 font-black hover:border-slate-900 transition-colors">
                                        {user.name.charAt(0)}
                                    </div>
                                </Link>
                            )}

                            {user && <NotificationBell />}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-2 sm:gap-4">
                    {user && (
                        <>
                            <NotificationBell />

                            <Link
                                href="/profile"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-sm font-black text-slate-700">
                                    {user.name.charAt(0)}
                                </div>
                            </Link>
                        </>
                    )}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 z-50">
                    {!user ? (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full font-bold h-12"
                                >
                                    Увійти
                                </Button>
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Button className="w-full bg-slate-900 text-white font-bold h-12">
                                    Реєстрація
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="pb-4 mb-2 border-b border-slate-100">
                                <p className="font-black text-slate-900 text-lg">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    {user.role}
                                </p>
                            </div>

                            {user.role === 'ORGANIZER' && (
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleCreateTournamentClick();
                                    }}
                                    className="flex w-full items-center gap-3 text-slate-700 font-bold py-3 hover:text-slate-900 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    Створити турнір
                                </button>
                            )}

                            {user.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 text-slate-900 font-bold py-3 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    Адмін-панель
                                </Link>
                            )}

                            <Link
                                href="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 text-slate-700 font-bold py-3 hover:text-slate-900 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                Мій профіль
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 text-red-600 font-bold py-3 w-full text-left hover:bg-red-50 rounded-xl transition-colors mt-2"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                Вийти
                            </button>
                        </div>
                    )}
                </div>
            )}

            <ApprovalModal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                isRejected={isRejected}
                onResubmit={handleResubmitRequest}
                isSubmitting={isSubmitting}
            />
        </header>
    );
}
