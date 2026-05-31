import { useDebounce } from '@/shared/hooks/useDebounce';
import { useEffect, useState } from 'react';
import { useTeams } from '@/features/teams';

const LIMIT_PER_PAGE = 9;

export function useTeamsPage() {
    const [search, setSearch] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(search, 500);
    const debouncedOwnerName = useDebounce(ownerName, 500);

    const { data, total, loading } = useTeams({
        page,
        limit: LIMIT_PER_PAGE,
        search: debouncedSearch,
        ownerName: debouncedOwnerName || undefined,
        sortBy: sortBy || undefined,
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, debouncedOwnerName, sortBy]);

    const sortOptions = [
        { value: 'members_desc', label: 'Більше учасників' },
        { value: 'members_asc', label: 'Менше учасників' },
        { value: 'wins_desc', label: 'Більше перемог' },
        { value: 'wins_asc', label: 'Менше перемог' },
    ];

    const totalPages = Math.ceil((total || 0) / LIMIT_PER_PAGE);

    return {
        filters: { search, ownerName, sortBy, page },
        actions: { setSearch, setOwnerName, setSortBy, setPage },
        options: { sortOptions },
        list: { data, totalPages, loading },
    };
}
