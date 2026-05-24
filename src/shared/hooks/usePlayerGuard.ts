import { useUserStore } from '@/app/store/user.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function usePlayerGuard() {
    const { user, loading } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'PLAYER')) {
            router.back();
        }
    }, [user, loading, router]);

    return { user, loading };
}