import { useState, useCallback, useEffect } from 'react';
import { IRegistration, ApplicationStatusType } from '@/entities/registration';
import { api } from '@/shared/api';
import { toast } from 'sonner';

export function useManageApplications(tournamentId: string) {
    const [applications, setApplications] = useState<IRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApplications = useCallback(async () => {
        if (!tournamentId) return;

        setLoading(true);
        setError('');

        try {
            const res = await api.get<IRegistration[]>(
                `/registrations/tournament/${tournamentId}`
            );
            setApplications(res);
        } catch (err) {
            console.error(err);
            setError('Не вдалося завантажити заявки');
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleStatusChange = async (
        registrationId: string,
        status: ApplicationStatusType
    ) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(
                `/registrations/${registrationId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchApplications();
        } catch (err) {
            console.error(err);
            toast('Помилка при зміні статусу');
        }
    };

    return {
        applications,
        loading,
        error,
        handleStatusChange,
        refetch: fetchApplications,
    };
}
