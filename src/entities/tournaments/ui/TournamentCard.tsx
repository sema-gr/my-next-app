'use client';

import { ITournament } from '../model/types';
import { Card, CardContent, Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { Trophy, Users, Calendar } from 'lucide-react';
import { getTournamentStatus } from '@/entities/tournaments';

export function TournamentCard({ tournament }: { tournament: ITournament }) {
    const router = useRouter();
    const status = tournament ? getTournamentStatus(tournament.status) : null;

    return (
        <Card className="rounded-3xl border-2 border-slate-100 hover:border-slate-900 hover:shadow-md transition-all group flex flex-col h-full overflow-hidden">
            <CardContent className="p-6 flex flex-col h-full flex-1">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors shrink-0">
                        <Trophy className="h-6 w-6 text-slate-300 group-hover:text-white transition-colors" />
                    </div>

                    <span className="text-[10px] font-black px-2 py-1 bg-green-50 text-green-600 rounded-md uppercase tracking-wider">
                        {status?.label}
                    </span>
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                        {tournament.title}
                    </h2>

                    {tournament.category && (
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            {tournament.category.name}
                        </p>
                    )}

                    <div className="space-y-2 mb-6">
                        <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            Макс. команд: {tournament.maxTeams}
                        </p>

                        <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(tournament.startDate).toLocaleDateString(
                                'uk-UA'
                            )}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => router.push(`/tournaments/${tournament.id}`)}
                    className="w-full bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-xl transition-colors mt-auto"
                >
                    Переглянути турнір
                </Button>
            </CardContent>
        </Card>
    );
}
