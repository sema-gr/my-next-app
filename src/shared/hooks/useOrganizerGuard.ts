import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useOrganizerGuard(user: any, loading: boolean) {
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'ORGANIZER')) {
            router.push('/');
        }
    }, [user, loading, router]);
}
