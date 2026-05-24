'use client';

import { CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui';
import {
    ApplicationStatus,
    useManageApplications,
} from '@/entities/registration';

export function ManageApplications({
    tournamentId,
    maxTeams,
}: {
    tournamentId: string;
    maxTeams: number;
}) {
    const { applications, loading, error, handleStatusChange } =
        useManageApplications(tournamentId);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
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
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-10 text-center border-dashed">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">
                    Наразі немає поданих заявок
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
                        <h3 className="font-black text-slate-900 text-lg">
                            {app.team.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">
                            Подано:{' '}
                            {new Date(app.createdAt).toLocaleDateString(
                                'uk-UA'
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {app.status === ApplicationStatus.PENDING ? (
                            <>
                                <Button
                                    onClick={() =>
                                        handleStatusChange(
                                            app.id,
                                            ApplicationStatus.APPROVED
                                        )
                                    }
                                    className="flex-1 sm:flex-none bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 font-bold"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />{' '}
                                    Схвалити
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleStatusChange(
                                            app.id,
                                            ApplicationStatus.REJECTED
                                        )
                                    }
                                    variant="outline"
                                    className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 font-bold"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />{' '}
                                    Відхилити
                                </Button>
                            </>
                        ) : (
                            <span
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                                    app.status === ApplicationStatus.APPROVED
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-red-50 text-red-600'
                                }`}
                            >
                                {app.status === ApplicationStatus.APPROVED ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <XCircle className="w-4 h-4" />
                                )}
                                {app.status === ApplicationStatus.APPROVED
                                    ? 'Схвалено'
                                    : 'Відхилено'}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
