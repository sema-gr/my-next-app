import { api } from '@/shared/api';
import { IPlayerResult } from '@/features/teams';

export const searchPlayers = async (query: string) => {
    const token = localStorage.getItem('token');

    return api.get<IPlayerResult[]>(`/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const addPlayerToTeam = async (teamId: string, userId: string) => {
    const token = localStorage.getItem('token');

    return api.post(
        `/teams/${teamId}/invites`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
