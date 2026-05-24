'use client';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInvitePlayer } from '@/features/teams';

interface InvitePlayerModalProps {
    teamId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    existingMemberIds: string[];
}

export function InvitePlayerModal(props: InvitePlayerModalProps) {
    const { teamId, isOpen, onClose, onSuccess, existingMemberIds } = props;

    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        addingPlayerId,
        addPlayer,
        reset,
    } = useInvitePlayer(teamId, isOpen);

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <h2 className="text-xl font-black text-slate-900">
                        Пошук гравця
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-1 min-h-0">
                    <div className="relative shrink-0">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Введіть нікнейм..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-200 py-3 pl-12 pr-4 rounded-xl font-bold focus:border-slate-900 focus:bg-white outline-none transition-all"
                        />
                    </div>

                    <div className="overflow-y-auto space-y-2 flex-1 pr-2 custom-scrollbar">
                        {isSearching ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((player) => {
                                const isAlreadyInTeam =
                                    existingMemberIds.includes(player.id);

                                return (
                                    <div
                                        key={player.id}
                                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 bg-white transition-colors"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {player.name}
                                            </p>
                                            <p className="text-xs font-bold text-slate-400 tracking-wider">
                                                @{player.username}
                                            </p>
                                        </div>

                                        {isAlreadyInTeam ? (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded uppercase">
                                                <CheckCircle2 className="w-3 h-3" />{' '}
                                                У команді
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    addPlayer(
                                                        player.id,
                                                        onSuccess,
                                                        handleClose
                                                    )
                                                }
                                                disabled={
                                                    addingPlayerId === player.id
                                                }
                                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
                                            >
                                                {addingPlayerId === player.id
                                                    ? '...'
                                                    : 'Додати'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : searchQuery.length >= 2 ? (
                            <div className="text-center py-10 text-sm font-medium text-slate-400">
                                Гравців не знайдено
                            </div>
                        ) : (
                            <div className="text-center py-10 text-sm font-medium text-slate-400">
                                Почніть вводити нікнейм...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
