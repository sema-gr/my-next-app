import { ITeam } from '@/entities/teams';
import { Users, CheckCircle2 } from 'lucide-react';

interface Props {
    team: ITeam;
    submitting: boolean;
    onApply: () => void;
}

export function TeamSelectItem({ team, submitting, onApply }: Props) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-300 bg-white transition-colors group">
            <div>
                <p className="font-black text-slate-900 text-lg">{team.name}</p>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" />
                    {team._count?.members || 1} гравців
                </p>
            </div>

            <button
                onClick={onApply}
                disabled={submitting}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
                {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                    <>
                        <CheckCircle2 className="w-4 h-4" /> Вибрати
                    </>
                )}
            </button>
        </div>
    );
}
