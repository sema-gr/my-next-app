'use client';

import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { IMatch } from '@/entities/matches';
import { MatchesResponse, UseMatchesParams } from '@/entities/matches';

export function useMatches(params: UseMatchesParams = {}) {
    const [data, setData] = useState<IMatch[]>([]);
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

        api.get<MatchesResponse>(`/matches${queryString}`)
            .then((res) => {
                const payload =
                    (res as any).data?.data !== undefined
                        ? (res as any).data
                        : res;
                setData(payload.data || []);
                setTotal(payload.total || 0);
            })
            .catch((err) => {
                console.error('Помилка завантаження матчів:', err);
            })
            .finally(() => setLoading(false));
    }, [JSON.stringify(params)]);

    return { data, total, loading };
}
