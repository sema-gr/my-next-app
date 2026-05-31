'use client';

import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { ITournament } from '@/entities/tournaments';
import { TournamentsResponse, UseTournamentsParams } from '@/features/tournaments';


export function useTournaments(params: UseTournamentsParams = {}) {
    const [data, setData] = useState<ITournament[]>([]);
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

        api.get<TournamentsResponse>(`/tournaments${queryString}`)
            .then((res) => {
                setData(res.data || []);
                setTotal(res.total || 0);
            })
            .catch((error) => {
                console.error('Помилка завантаження турнірів:', error);
            })
            .finally(() => setLoading(false));
    }, [JSON.stringify(params)]);

    return { data, total, loading };
}
