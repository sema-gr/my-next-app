import { useMatches } from "@/entities/matches";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useEffect, useState } from "react";

export const LIMIT_PER_PAGE = 9;

export const MATCH_STATUS_OPTIONS = [
    { value: 'SCHEDULED', label: 'Заплановано' },
    { value: 'ONGOING', label: 'Триває' },
    { value: 'FINISHED', label: 'Завершено' },
];

export function useMatchesPage() {
    const [teamName, setTeamName] = useState('');
    const [status, setStatus] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    const debouncedTeamName = useDebounce(teamName, 500);

    const { data, total, loading } = useMatches({
        page,
        limit: LIMIT_PER_PAGE,
        teamName: debouncedTeamName,
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedTeamName, status, dateFrom, dateTo]);

    const totalPages = Math.ceil((total || 0) / LIMIT_PER_PAGE);

    const resetDates = () => {
        setDateFrom('');
        setDateTo('');
    };

    return {
        filters: { teamName, status, dateFrom, dateTo, page },
        actions: {
            setTeamName,
            setStatus,
            setDateFrom,
            setDateTo,
            setPage,
            resetDates,
        },
        list: { data, totalPages, loading },
    };
}
