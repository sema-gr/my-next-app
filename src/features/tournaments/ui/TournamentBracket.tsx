'use client';

import { useState, useEffect } from 'react';
import { Trophy, Clock, Medal } from 'lucide-react';
import { TeamInfo } from '@/entities/teams';
import { Match, MatchStatus } from '@/entities/matches';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

interface TournamentBracketProps {
    matches: Match[];
    teams: TeamInfo[];
    isOrganizer: boolean;
    onMatchUpdate?: (matchId: string, scoreA: number, scoreB: number) => void;
}

export function TournamentBracket({
    matches,
    teams,
    isOrganizer,
    onMatchUpdate,
}: TournamentBracketProps) {
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [scoreA, setScoreA] = useState('');
    const [scoreB, setScoreB] = useState('');

    // 1. Стейт для перевірки, чи компонент завантажився в браузері
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. Більш жорстке блокування скролу
    useEffect(() => {
        if (selectedMatch) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // Для мобільних пристроїв
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [selectedMatch]);

    const getTeamName = (teamId: string | null) => {
        if (!teamId) return 'BYE (Автопрохід)';
        return teams.find((t) => t.id === teamId)?.name || 'Невідома команда';
    };

    const rounds = Array.from(new Set(matches.map((m) => m.round))).sort(
        (a, b) => a - b
    );
    const groupedMatches = rounds.map((round) =>
        matches.filter((m) => m.round === round)
    );

    const finalMatch = groupedMatches[groupedMatches.length - 1]?.[0];
    const winnerId =
        finalMatch?.status === MatchStatus.FINISHED
            ? finalMatch.winnerId
            : null;
    const winnerTeam = winnerId ? teams.find((t) => t.id === winnerId) : null;

    const handleMatchClick = (match: Match) => {
        if (!isOrganizer || match.status === MatchStatus.FINISHED) return;
        if (!match.teamAId || !match.teamBId) {
            toast.error('Обидві команди ще не визначені для цього матчу!');
            return;
        }

        setSelectedMatch(match);
        setScoreA(match.scoreA.toString());
        setScoreB(match.scoreB.toString());
    };

    const handleSubmitScore = () => {
        if (!selectedMatch || !onMatchUpdate) return;
        if (scoreA === scoreB) {
            toast.error('У форматі Play-off не може бути нічиєї!');
            return;
        }
        onMatchUpdate(selectedMatch.id, Number(scoreA), Number(scoreB));
        setSelectedMatch(null);
    };

    return (
        <div className="w-full space-y-10">
            {winnerTeam && (
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-center shadow-lg border border-yellow-300 animate-in zoom-in duration-500">
                    <Trophy className="w-20 h-20 mx-auto text-yellow-900 mb-4 drop-shadow-sm" />
                    <h2 className="text-3xl md:text-5xl font-black text-yellow-950 uppercase tracking-tight mb-4">
                        Переможець Турніру!
                    </h2>
                    <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-3 rounded-2xl shadow-sm border border-yellow-200">
                        <Medal className="w-6 h-6 text-yellow-500" />
                        <span className="text-2xl font-bold text-slate-900">
                            {winnerTeam.name}
                        </span>
                    </div>
                </div>
            )}

            <div className="bg-slate-50/50 rounded-3xl border border-slate-200/60 p-4 md:p-8">
                <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex gap-12 lg:gap-20 py-4 w-fit mx-auto min-h-[300px] items-center">
                        {groupedMatches.map((roundMatches, roundIndex) => (
                            <div
                                key={roundIndex}
                                className="flex flex-col gap-8 min-w-[280px] w-[300px]"
                            >
                                <div className="flex justify-center shrink-0">
                                    <span className="inline-flex items-center justify-center px-5 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-md">
                                        {roundIndex === rounds.length - 1
                                            ? 'Фінал'
                                            : roundIndex === rounds.length - 2
                                              ? 'Півфінал'
                                              : `Раунд ${roundIndex + 1}`}
                                    </span>
                                </div>

                                <div className="flex flex-col justify-center gap-8 flex-1">
                                    {roundMatches.map((match) => {
                                        const isClickable =
                                            isOrganizer &&
                                            match.status === 'SCHEDULED' &&
                                            match.teamAId &&
                                            match.teamBId;

                                        const isMatchFinished =
                                            match.status === 'FINISHED';

                                        return (
                                            <div
                                                key={match.id}
                                                onClick={() =>
                                                    handleMatchClick(match)
                                                }
                                                className={`group relative bg-white border-2 rounded-2xl overflow-hidden transition-all duration-200
                                                    ${isMatchFinished ? 'border-slate-200 shadow-sm' : 'border-slate-200 shadow-md'}
                                                    ${isClickable ? 'hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
                                                `}
                                            >
                                                <div className="bg-slate-50/80 border-b border-slate-100 py-2 px-4 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Матч #
                                                        {match.id.slice(0, 4)}
                                                    </span>
                                                    {isMatchFinished ? (
                                                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                                    ) : (
                                                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center p-4 border-b border-slate-50">
                                                    <span
                                                        className={`text-sm truncate pr-3 flex items-center gap-2 ${match.winnerId === match.teamAId ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}
                                                    >
                                                        {match.winnerId ===
                                                            match.teamAId && (
                                                            <Medal className="w-4 h-4 text-green-500 shrink-0" />
                                                        )}
                                                        {getTeamName(
                                                            match.teamAId
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`flex items-center justify-center min-w-[32px] h-8 rounded-lg text-sm font-black transition-colors
                                                        ${isMatchFinished && match.winnerId === match.teamAId ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-700'}
                                                    `}
                                                    >
                                                        {isMatchFinished
                                                            ? match.scoreA
                                                            : '-'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center p-4">
                                                    <span
                                                        className={`text-sm truncate pr-3 flex items-center gap-2 ${match.winnerId === match.teamBId ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}
                                                    >
                                                        {match.winnerId ===
                                                            match.teamBId && (
                                                            <Medal className="w-4 h-4 text-green-500 shrink-0" />
                                                        )}
                                                        {getTeamName(
                                                            match.teamBId
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`flex items-center justify-center min-w-[32px] h-8 rounded-lg text-sm font-black transition-colors
                                                        ${isMatchFinished && match.winnerId === match.teamBId ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-700'}
                                                    `}
                                                    >
                                                        {isMatchFinished
                                                            ? match.scoreB
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {mounted &&
                selectedMatch &&
                createPortal(
                    <div className="fixed top-0 left-0 w-screen h-[100dvh] z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-slate-900 mb-2">
                                    Результат матчу
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">
                                    Внесіть фінальний рахунок
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                                    <span className="font-bold text-slate-700 w-[60%] truncate">
                                        {getTeamName(selectedMatch.teamAId)}
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={scoreA}
                                        onChange={(e) =>
                                            setScoreA(e.target.value)
                                        }
                                        className="w-20 text-center text-xl font-black bg-white border border-slate-300 rounded-xl py-2 focus:outline-none focus:border-blue-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                                    <span className="font-bold text-slate-700 w-[60%] truncate">
                                        {getTeamName(selectedMatch.teamBId)}
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={scoreB}
                                        onChange={(e) =>
                                            setScoreB(e.target.value)
                                        }
                                        className="w-20 text-center text-xl font-black bg-white border border-slate-300 rounded-xl py-2 focus:outline-none focus:border-blue-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => setSelectedMatch(null)}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    onClick={handleSubmitScore}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-700 shadow-lg shadow-slate-600/30 transition-all active:scale-95"
                                >
                                    Зберегти
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
