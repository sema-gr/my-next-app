'use client';

import { useState, useEffect } from 'react';
import { Trophy, CalendarDays, Users } from 'lucide-react';
import {
    ISelectCategory,
    MAX_TEAMS_OPTIONS,
    TOURNAMENT_STATUSES,
    TournamentCard,
} from '@/entities/tournaments';
import { useTournaments } from '@/features/tournaments';
import { ListGrid, FilterBar, FilterSelect } from '@/shared/ui';
import { Pagination } from '@/shared/ui/Pagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { api } from '@/shared/api';
import { toast } from 'sonner';

const LIMIT_PER_PAGE = 9;

export function TournamentsList() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sport, setSport] = useState('');
    const [maxTeams, setMaxTeams] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    const [categories, setCategories] = useState<
        { id: string; name: string }[]
    >([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        api.get<ISelectCategory[]>('/categories')
            .then((res) => {
                const fetchedCategories = Array.isArray(res) ? res : res || [];
                setCategories(fetchedCategories);
            })
            .catch(() => toast.error('Не вдалося завантажити категорії'))
            .finally(() => setIsLoadingCategories(false));
    }, []);

    const { data, total, loading } = useTournaments({
        page,
        limit: LIMIT_PER_PAGE,
        search: debouncedSearch,
        status: status || undefined,
        categoryId: sport || undefined,
        maxTeams: maxTeams || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, sport, maxTeams, dateFrom, dateTo]);

    const statusOptions = Object.entries(TOURNAMENT_STATUSES).map(
        ([value, label]) => ({
            value,
            label,
        })
    );

    const sportOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const totalPages = Math.ceil((total || 0) / LIMIT_PER_PAGE);

    return (
        <div>
            <FilterBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Пошук турнірів..."
            >
                <FilterSelect
                    value={sport}
                    onChange={setSport}
                    options={sportOptions}
                    placeholder={
                        isLoadingCategories
                            ? 'Завантаження...'
                            : 'Усі види спорту'
                    }
                    icon={<Trophy className="w-5 h-5 text-slate-400" />}
                />

                <FilterSelect
                    value={status}
                    onChange={setStatus}
                    options={statusOptions}
                    placeholder="Усі статуси"
                />

                <FilterSelect
                    value={maxTeams}
                    onChange={setMaxTeams}
                    options={MAX_TEAMS_OPTIONS}
                    placeholder="Кількість учасників"
                    icon={<Users className="w-5 h-5 text-slate-400" />}
                />
            </FilterBar>

            <div className="flex items-end gap-4 mb-8 max-sm:flex-wrap">
                <div className="flex-1 max-w-[200px] flex flex-col">
                    <label className="text-xs font-medium text-slate-500 mb-1.5 ml-1">
                        Дата початку
                    </label>
                    <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm text-slate-600 max-sm:w-40"
                        />
                    </div>
                </div>

                <div className="flex-1 max-w-[200px] flex flex-col">
                    <label className="text-xs font-medium text-slate-500 mb-1.5 ml-1">
                        Дата кінця
                    </label>
                    <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm text-slate-600 max-sm:w-40"
                        />
                    </div>
                </div>

                {(dateFrom || dateTo) && (
                    <button
                        onClick={() => {
                            setDateFrom('');
                            setDateTo('');
                        }}
                        className="h-11 px-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
                    >
                        Скинути дати
                    </button>
                )}
            </div>

            <ListGrid
                items={data}
                loading={loading}
                emptyText="За вашим запитом турнірів не знайдено"
                renderItem={(t) => <TournamentCard key={t.id} tournament={t} />}
            />

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}
