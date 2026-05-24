import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    addPlayerToTeam,
    IPlayerResult,
    searchPlayers,
} from '@/features/teams';

export function useInvitePlayer(teamId: string, isOpen: boolean) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<IPlayerResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [addingPlayerId, setAddingPlayerId] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setIsSearching(true);
                const res = await searchPlayers(searchQuery);
                setSearchResults(res);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [searchQuery, isOpen]);

    const addPlayer = async (
        userId: string,
        onSuccess: () => void,
        onClose: () => void
    ) => {
        try {
            setAddingPlayerId(userId);

            await addPlayerToTeam(teamId, userId);

            toast.success('Гравця успішно додано!');
            onClose();
            onSuccess();
        } catch (e: any) {
            toast(e.message || 'Помилка');
        } finally {
            setAddingPlayerId(null);
        }
    };

    const reset = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        addingPlayerId,
        addPlayer,
        reset,
    };
}
