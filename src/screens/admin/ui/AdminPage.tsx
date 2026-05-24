'use client';

import { useState } from 'react';
import { StatBox } from '@/shared/ui';
import { useAdminDashboard } from '@/features/admin';
import {
    Shield,
    Users,
    Trophy,
    Activity,
    Check,
    X,
    Building,
    Clock,
    ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '@/app/store/user.store';
import { useRouter } from 'next/navigation';
import { AdminFallback } from '@/features/profile';

export function AdminPage() {
    const { user } = useUserStore();
    const router = useRouter();
    const { stats, pendingOrganizers, loading, handleApprove, handleReject } =
        useAdminDashboard();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    const onApprove = async (userId: string) => {
        setActionLoading(userId);
        await handleApprove(userId);
        setActionLoading(null);
        toast.success('Організатора успішно підтверджено!');
    };

    const onReject = async (userId: string) => {
        setActionLoading(userId);
        await handleReject(userId);
        setActionLoading(null);
        toast.error('Заявку організатора відхилено.');
    };

    if (user?.role !== 'ADMIN') {
        return <AdminFallback />;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,0.2)] transform -rotate-3 shrink-0">
                    <Shield className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        Панель Адміністратора
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-widest">
                        Глобальна статистика та модерація
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Статистика платформи
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatBox
                        title="Всі Команди"
                        value={stats?.totalTeams || 0}
                        icon={<Users />}
                    />
                    <StatBox
                        title="Турніри"
                        value={stats?.totalTournaments || 0}
                        icon={<Trophy />}
                    />
                    <StatBox
                        title="Зіграні Матчі"
                        value={stats?.totalMatches || 0}
                        icon={<Activity />}
                    />
                    <div className="bg-slate-900 text-white rounded-2xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(203,213,225,1)] flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Нові Заявки
                            </h4>
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-black">
                            {stats?.pendingRequests || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Building className="w-4 h-4" /> Заявки на статус
                    організатора
                </h3>

                {!pendingOrganizers || pendingOrganizers.length === 0 ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-slate-900 mb-1">
                            Все перевірено
                        </h4>
                        <p className="text-slate-500 font-bold text-sm">
                            Наразі немає нових заявок від організаторів.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingOrganizers.map((org) => (
                            <div
                                key={org.id}
                                className="bg-white border-2 border-slate-200 rounded-3xl p-6 hover:border-slate-900 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between gap-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                                            {org.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-lg leading-tight">
                                                {org.name}
                                            </h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1">
                                                @{org.username} • {org.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Організація / Компанія
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {org.organizationName || 'Не вказано'}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onReject(org.id)}
                                        disabled={actionLoading === org.id}
                                        className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" /> Відхилити
                                    </button>
                                    <button
                                        onClick={() => onApprove(org.id)}
                                        disabled={actionLoading === org.id}
                                        className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.3)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                                    >
                                        <Check className="w-5 h-5" />{' '}
                                        Підтвердити
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
