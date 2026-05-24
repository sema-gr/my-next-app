import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GuestFallback() {
    const router = useRouter();

    return (
        <div className="flex items-center flex-col gap-10 text-center py-20">
            <p className="text-slate-500 italic">
                Будь ласка, увійдіть в акаунт
            </p>

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900"
            >
                <ArrowLeft className="w-4 h-4" /> Назад
            </button>
        </div>
    );
}
