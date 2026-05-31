'use client';

import { Search, ArrowUpDown } from 'lucide-react';
import { TeamCard } from '@/entities/teams';
import { ListGrid, FilterBar, FilterSelect } from '@/shared/ui';
import { Pagination } from '@/shared/ui/Pagination';
import { useTeamsPage } from '@/features/teams';

export function TeamsList() {
    const { filters, actions, options, list } = useTeamsPage();

    return (
        <div>
            <FilterBar
                search={filters.search}
                onSearchChange={actions.setSearch}
                searchPlaceholder="Пошук за назвою команди..."
            >
                <div className="relative min-w-[200px] flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={filters.ownerName}
                        onChange={(e) => actions.setOwnerName(e.target.value)}
                        placeholder="Ім'я командира..."
                        className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    />
                </div>

                <FilterSelect
                    value={filters.sortBy}
                    onChange={actions.setSortBy}
                    options={options.sortOptions}
                    placeholder="Сортування"
                    icon={<ArrowUpDown className="w-5 h-5 text-slate-400" />}
                />
            </FilterBar>

            <ListGrid
                items={list.data}
                loading={list.loading}
                emptyText="За вашим запитом команд не знайдено"
                renderItem={(team) => <TeamCard key={team.id} team={team} />}
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
