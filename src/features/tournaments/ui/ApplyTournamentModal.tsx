'use client';

import { X, ShieldAlert } from 'lucide-react';
import { TeamSelectItem, useApplyTournament } from '@/features/tournaments';

interface Props {
    tournamentId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ApplyTournamentModal({
    tournamentId,
    isOpen,
    onClose,
    onSuccess,
}: Props) {
    const { teams, loading, error, submittingId, apply } = useApplyTournament(
        tournamentId,
        isOpen
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md flex flex-col max-h-[100vh]">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="font-bold text-lg">Подача заявки</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-3">
                    {error && (
                        <div className="text-red-500 flex items-center gap-2">
                            <ShieldAlert /> {error}
                        </div>
                    )}

                    {loading ? (
                        <div>Loading...</div>
                    ) : teams.length ? (
                        teams.map((team) => (
                            <TeamSelectItem
                                key={team.id}
                                team={team}
                                submitting={submittingId === team.id}
                                onApply={() =>
                                    apply(team.id, onSuccess, onClose)
                                }
                            />
                        ))
                    ) : (
                        <div>Немає команд</div>
                    )}
                </div>
            </div>
        </div>
    );
}
