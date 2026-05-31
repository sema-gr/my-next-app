import { Search } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;
    children?: ReactNode;
}

export function FilterBar({
    search,
    onSearchChange,
    searchPlaceholder = 'Пошук...',
    children,
}: FilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
            </div>

            {children && (
                <div className="flex flex-col sm:flex-row gap-4">
                    {children}
                </div>
            )}
        </div>
    );
}
