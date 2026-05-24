'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, AlertCircle } from 'lucide-react';
import { usePlayerGuard } from '@/shared/hooks';
import { useCreateTeam } from '@/entities/teams';
import { PlayerOnlyFallback } from '@/features/teams';

export function CreateTeamPage() {
    const router = useRouter();

    const { user, loading } = usePlayerGuard();
    const { name, setName, submitting, error, createTeam } = useCreateTeam();

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    if (!user || user.role !== 'PLAYER') {
        return <PlayerOnlyFallback />;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors -ml-2 p-2 rounded-lg hover:bg-slate-50"
                >
                    <ArrowLeft className="w-4 h-4" /> Назад
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white  shadow-lg transform -rotate-3">
                        <Users className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Створення команди
                    </h1>
                </div>
                <p className="text-slate-500 font-medium">
                    Придумайте унікальну назву. Після створення ви автоматично
                    станете капітаном.
                </p>
            </div>

            <div className="bg-white border-2 border-slate-900 p-6 md:p-10 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createTeam();
                    }}
                    className="space-y-6"
                >
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm font-bold">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
                            Назва команди
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Наприклад: Natus Vincere"
                            disabled={submitting}
                            className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:border-slate-900 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                        />
                    </div>

                    <button
                        disabled={submitting || !name.trim()}
                        className="w-full bg-slate-900 text-white font-bold text-lg px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                        ) : (
                            'Створити команду'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
