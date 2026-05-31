'use client';

import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { ITeam } from '@/entities/teams';
import { TeamsResponse, UseTeamsParams } from '@/features/teams';

export function useTeams(params: UseTeamsParams = {}) {
    const [data, setData] = useState<ITeam[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                queryParams.append(key, String(value));
            }
        });

        const queryString = queryParams.toString()
            ? `?${queryParams.toString()}`
            : '';

        api.get<TeamsResponse>(`/teams${queryString}`)
            .then((res) => {
                const payload =
                    (res as any).data?.data !== undefined
                        ? (res as any).data
                        : res;
                setData(payload.data || []);
                setTotal(payload.total || 0);
            })
            .catch((err) => {
                console.error('Помилка завантаження команд:', err);
            })
            .finally(() => setLoading(false));
    }, [JSON.stringify(params)]);

    return { data, total, loading };
}
