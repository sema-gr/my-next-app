import { ReactNode } from 'react';

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string;
}

export function InfoCard({ icon, label, value }: InfoCardProps) {
    return (
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors">
            <div className="w-6 h-6 text-slate-400 mb-3">{icon}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {label}
            </p>
            <p className="text-lg font-black text-slate-900">{value}</p>
        </div>
    );
}
