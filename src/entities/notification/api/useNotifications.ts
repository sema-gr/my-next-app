'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/api';
import { INotification } from '../model/types';
import { useUserStore } from '@/app/store/user.store';

export function useNotifications() {
    const { user } = useUserStore();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        const token = localStorage.getItem('token');
        try {
            const data = await api.get<INotification[]>('/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(data);
        } catch (error) {
            console.error('Помилка завантаження сповіщень', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        const token = localStorage.getItem('token');
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        try {
            await api.patch(
                `/notifications/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error('Помилка оновлення статусу', error);
            fetchNotifications();
        }
    };

    const markAllAsRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        const token = localStorage.getItem('token');
        try {
            await api.patch(
                '/notifications/read-all',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error('Помилка оновлення статусу', error);
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
    };
}
