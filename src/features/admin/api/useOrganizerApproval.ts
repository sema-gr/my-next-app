import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user.store';
import { api } from '@/shared/api';

export function useOrganizerApproval() {
    const { user } = useUserStore();
    const router = useRouter();

    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isRejected = user?.organizerStatus === 'REJECTED';

    const handleCreateTournamentClick = (beforeOpenModalAction?: () => void) => {

        if (beforeOpenModalAction) {
            beforeOpenModalAction();
        }

        if (!user?.isApprovedOrganizer) {
            setIsApprovalModalOpen(true);
        } else {
            router.push('/tournaments/create');
        }
    };

    const handleResubmitRequest = async () => {
        setIsSubmitting(true);
        try {
            await api.patch('/users/organizer/resubmit', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setIsApprovalModalOpen(false);
        } catch (error) {
            console.error('Помилка відправки запиту:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isApprovalModalOpen,
        setIsApprovalModalOpen,
        isRejected,
        isSubmitting,
        handleCreateTournamentClick,
        handleResubmitRequest
    };
}