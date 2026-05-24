import Link from 'next/link';
import { Clock, Trophy, Swords, Calendar } from 'lucide-react';
import { IMatch } from '@/entities/matches';

interface MatchCardProps {
    match: IMatch;
}

export function MatchCard({ match }: MatchCardProps) {
    const isFinished = match.status === 'FINISHED';
    const teamAName = match.teamA?.name || 'Очікується';
    const teamBName = match.teamB?.name || 'Очікується';

    return (
        <Link href={`/tournaments/${match.tournamentId}`}>
            <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-900 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate pr-4">
                        {match.tournament?.title || 'Турнір'}
                    </span>

                    {isFinished ? (
                        <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                            <Trophy className="w-3 h-3" />
                            Завершено
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                            <Clock className="w-3 h-3" />
                            Очікується
                        </span>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-center gap-3">
                    <div className="flex justify-between items-center">
                        <span
                            className={`text-sm font-semibold truncate pr-2 ${match.winnerId === match.teamAId ? 'text-green-600 font-bold' : 'text-slate-800'}`}
                        >
                            {teamAName}
                        </span>
                        <span className="text-lg font-black text-slate-900 bg-slate-100 w-8 h-8 flex items-center justify-center rounded-lg">
                            {isFinished ? match.scoreA : '-'}
                        </span>
                    </div>

                    <div className="flex justify-center -my-2 opacity-30">
                        <Swords className="w-10 h-10 text-slate-400" />
                    </div>

                    <div className="flex justify-between items-center">
                        <span
                            className={`text-sm font-semibold truncate pr-2 ${match.winnerId === match.teamBId ? 'text-green-600 font-bold' : 'text-slate-800'}`}
                        >
                            {teamBName}
                        </span>
                        <span className="text-lg font-black text-slate-900 bg-slate-100 w-8 h-8 flex items-center justify-center rounded-lg">
                            {isFinished ? match.scoreB : '-'}
                        </span>
                    </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {match.createdAt
                            ? new Date(match.createdAt).toLocaleDateString(
                                  'uk-UA'
                              )
                            : 'Дата не призначена'}
                    </span>
                    <span>Раунд {match.round || 1}</span>
                </div>
            </div>
        </Link>
    );
}
