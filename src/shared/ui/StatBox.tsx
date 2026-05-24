export function StatBox({
    title,
    value,
    icon,
    highlight = false,
}: {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <div
            className={`p-6 rounded-3xl border ${highlight ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 shadow-sm'}`}
        >
            <div className="flex items-center justify-between mb-4">
                <span
                    className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-slate-400' : 'text-slate-400'}`}
                >
                    {title}
                </span>
                {icon}
            </div>
            <p
                className={`text-3xl font-black tracking-tighter ${highlight ? 'text-white' : 'text-slate-900'}`}
            >
                {value}
            </p>
        </div>
    );
}
