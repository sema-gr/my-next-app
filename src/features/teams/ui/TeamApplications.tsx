'use client';

import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import {
    CheckCircle2,
    XCircle,
    Clock,
    ShieldAlert,
    Trophy,
} from 'lucide-react';
import { ITeamRegistration } from '@/features/teams';
import { ApplicationStatus } from '@/entities/registration';

export function TeamApplications({ teamId }: { teamId: string }) {
    const [applications, setApplications] = useState<ITeamRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeamApplications = async () => {
            try {
                setLoading(true);
                const res = await api.get<ITeamRegistration[]>(
                    `/registrations/team/${teamId}`
                );
                setApplications(res);
            } catch (err) {
                console.error(err);
                setError('Не вдалося завантажити історію заявок');
            } finally {
                setLoading(false);
            }
        };

        if (teamId) {
            fetchTeamApplications();
        }
    }, [teamId]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> {error}
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="bg-white border-2 border-slate-100 p-10 rounded-3xl text-center border-dashed">
                <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">Немає заявок</h3>
                <p className="text-sm text-slate-500 font-medium">
                    Ваша команда ще не подавала заявки на жоден турнір.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app) => (
                <div
                    key={app.id}
                    className="bg-white border-2 border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <h3 className="font-black text-slate-900 text-lg">
                                {app.tournament.title}
                            </h3>
                        </div>
                        <p className="text-xs font-bold text-slate-400">
                            Подано:{' '}
                            {new Date(app.createdAt).toLocaleDateString(
                                'uk-UA'
                            )}
                        </p>
                    </div>

                    <div>
                        {app.status === ApplicationStatus.PENDING && (
                            <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-slate-100 text-slate-600">
                                <Clock className="w-4 h-4" /> В очікуванні
                            </span>
                        )}
                        {app.status === ApplicationStatus.APPROVED && (
                            <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-green-50 text-green-600">
                                <CheckCircle2 className="w-4 h-4" /> Схвалено
                            </span>
                        )}
                        {app.status === ApplicationStatus.REJECTED && (
                            <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-red-50 text-red-600">
                                <XCircle className="w-4 h-4" /> Відхилено
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
