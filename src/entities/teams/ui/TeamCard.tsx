'use client';

import { ITeam } from '../model/types';
import { Card, CardContent } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { Users, Crown } from 'lucide-react';

export function TeamCard({ team }: { team: ITeam }) {
    const router = useRouter();

    return (
        <Card
            onClick={() => router.push(`/teams/${team.id}`)}
            className="rounded-3xl border-2 border-slate-100 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer group"
        >
            <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4 flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                        {team.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
                            {team.name}
                        </h2>

                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                            <Crown className="w-3 h-3 text-yellow-500" />
                            Капітан: {team.owner?.name || 'Невідомо'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-100">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">
                            {team._count?.members} учасників
                        </span>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                        Деталі команди →
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
