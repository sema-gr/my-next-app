import { API_BASE_URL } from '../config';

export const api = {
    get: async <T>(url: string, options?: RequestInit) => {
        const res = await fetch(API_BASE_URL + url, {
            method: 'GET',
            ...options,
            cache: 'no-store',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || 'Помилка отримання даних');
        }
        return res.json() as Promise<T>;
    },

    post: async <T>(url: string, data: any, options?: RequestInit) => {
        const { headers, ...restOptions } = options || {};

        const res = await fetch(API_BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(data),
            ...restOptions,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || 'Помилка сервера');
        }
        return res.json() as Promise<T>;
    },

    put: async <T>(url: string, data: any) => {
        const res = await fetch(API_BASE_URL + url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Помилка оновлення');
        return res.json() as Promise<T>;
    },

    patch: async <T>(url: string, data: any, options?: RequestInit) => {
        const { headers, ...restOptions } = options || {};

        const res = await fetch(API_BASE_URL + url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(data),
            ...restOptions,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || 'Помилка сервера');
        }
        return res.json() as Promise<T>;
    },

    delete: async (url: string) => {
        const token = localStorage.getItem('token');
        
        const res = await fetch(API_BASE_URL + url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));

            throw new Error(error.message || 'Помилка видалення');
        }

        return res.json();
    },
};
