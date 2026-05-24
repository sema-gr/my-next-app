import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { AdminStats, PendingOrganizer } from '@/features/admin';

export function useAdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [pendingOrganizers, setPendingOrganizers] = useState<
        PendingOrganizer[]
    >([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, organizersRes] = await Promise.all([
                api.get<AdminStats>('/admin/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
                api.get<PendingOrganizer[]>('/admin/organizers/pending', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
            ]);

            setStats(statsRes);
            setPendingOrganizers(organizersRes || organizersRes);
        } catch (error) {
            console.error('Помилка завантаження адмін-панелі', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            await api.patch(
                `/admin/organizers/${userId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setPendingOrganizers((prev) =>
                prev.filter((org) => org.id !== userId)
            );
            setStats((prev) =>
                prev
                    ? { ...prev, pendingRequests: prev.pendingRequests - 1 }
                    : null
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleReject = async (userId: string) => {
        try {
            await api.patch(
                `/admin/organizers/${userId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setPendingOrganizers((prev) =>
                prev.filter((org) => org.id !== userId)
            );
            setStats((prev) =>
                prev
                    ? { ...prev, pendingRequests: prev.pendingRequests - 1 }
                    : null
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        stats,
        pendingOrganizers,
        loading,
        handleApprove,
        handleReject,
    };
}
