'use client';

import { AdminFallback, GuestFallback, useProfile } from '@/features/profile';
import { StatBox } from '@/shared/ui';
import { ProfileActivity } from '@/widgets/profile';
import {
    Trophy,
    Mail,
    ShieldCheck,
    Activity,
    Hash,
    Calendar,
    CircleX,
    ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProfilePage() {
    const { user, loading, stats } = useProfile();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    if (!user) return <GuestFallback />;
    if (user.role === 'ADMIN') return <AdminFallback />;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-6 animate-in fade-in duration-700">
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors -ml-2 p-2 rounded-lg hover:bg-slate-50"
                >
                    <ArrowLeft className="w-4 h-4" /> Назад
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl transform -rotate-3">
                        {user.name.charAt(0)}
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

                {user.role === 'ORGANIZER' &&
                    user.organizationName &&
                    user.isApprovedOrganizer === true && (
                        <div className="w-full md:w-auto bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                                Офіційний представник
                            </p>
                            <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-slate-900" />{' '}
                                {user.organizationName}
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
                        value={`${stats.winRate}%`}
                        highlight
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Контакти
                        </h3>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <div className="truncate">
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                                    Електронна пошта
                                </p>
                                <p className="text-sm font-bold text-slate-700 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                            Акаунт створено
                        </h3>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-sm font-bold text-slate-700">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString('uk-UA')}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <ProfileActivity user={user} />
            </div>
        </div>
    );
}
