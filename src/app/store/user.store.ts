import { create } from 'zustand';
import { IUser } from '@/entities/user';
import { api } from '@/shared/api';
import { toast } from 'sonner';

type UserState = {
    user: IUser | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    setUser: (user: IUser | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: false,
    setUser: (user) => set({ user }),
    fetchUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ loading: true });
        try {
            const res = await api.get<IUser>('/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ user: res });
        } catch (error: any) {
            // toast.error(
            //     error?.message || 'Помилка отримання даних користувача'
            // );
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));
