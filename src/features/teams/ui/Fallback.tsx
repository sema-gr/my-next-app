import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PlayerOnlyFallback() {
    const router = useRouter();

    return (
        <div className="flex items-center flex-col gap-6 text-center py-32">
            <ShieldAlert className="w-16 h-16 text-red-500" />

            <h2 className="text-2xl font-black">Доступ заборонено</h2>

            <p className="text-slate-500 max-w-md">
                Тільки гравці можуть створювати команди
            </p>

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Назад
            </button>
        </div>
    );
}
