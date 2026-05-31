'use client';

import { CalendarDays, Activity } from 'lucide-react';
import { MatchCard } from '@/entities/matches';
import { ListGrid, FilterBar, FilterSelect } from '@/shared/ui';
import { Pagination } from '@/shared/ui/Pagination';
import { MATCH_STATUS_OPTIONS, useMatchesPage } from '@/features/matches';

export function MatchesList() {
    const { filters, actions, list } = useMatchesPage();

    return (
        <div>
            <FilterBar
                search={filters.teamName}
                onSearchChange={actions.setTeamName}
                searchPlaceholder="Пошук за назвою команди..."
            >
                <FilterSelect
                    value={filters.status}
                    onChange={actions.setStatus}
                    options={MATCH_STATUS_OPTIONS}
                    placeholder="Усі статуси"
                    icon={<Activity className="w-5 h-5 text-slate-400" />}
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
                            value={filters.dateFrom}
                            onChange={(e) =>
                                actions.setDateFrom(e.target.value)
                            }
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
                            value={filters.dateTo}
                            onChange={(e) => actions.setDateTo(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm text-slate-600 max-sm:w-40"
                        />
                    </div>
                </div>

                {(filters.dateFrom || filters.dateTo) && (
                    <button
                        onClick={actions.resetDates}
                        className="h-11 px-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
                    >
                        Скинути дати
                    </button>
                )}
            </div>

            <ListGrid
                items={list.data}
                loading={list.loading}
                emptyText="За вашим запитом матчів не знайдено"
                renderItem={(match) => (
                    <MatchCard key={match.id} match={match} />
                )}
            />

            {list.totalPages > 1 && (
                <Pagination
                    currentPage={filters.page}
                    totalPages={list.totalPages}
                    onPageChange={actions.setPage}
                />
            )}
        </div>
    );
}
