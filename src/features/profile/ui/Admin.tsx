import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminFallback() {
    const router = useRouter();

    return (
        <div className="flex items-center flex-col gap-10 text-center py-32">
            <ShieldCheck className="w-16 h-16 text-slate-300" />

            <h2 className="text-2xl font-bold">Доступ заборонено</h2>

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Назад
            </button>
        </div>
    );
}
