'use client';

import { CheckCircle2, XCircle, UserPlus, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useJoinTeams } from '@/features/teams';

export function ManageJoinRequests({ teamId }: { teamId: string }) {
    const { loading, requests, error, handleStatusChange } =
        useJoinTeams(teamId);

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

    if (requests.length === 0) {
        return (
            <div className="bg-white border-2 border-slate-100 p-10 rounded-3xl text-center border-dashed">
                <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">
                    Немає нових запитів
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                    Наразі ніхто не подавав заявку на вступ до вашої команди.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((req) => (
                <div
                    key={req.id}
                    className="bg-white border-2 border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg font-black">
                            {req.user.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">
                                {req.user.name}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                                @{req.user.username}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button
                            onClick={() =>
                                handleStatusChange(req.id, 'APPROVED')
                            }
                            className="flex-1 sm:flex-none bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 font-bold"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Прийняти
                        </Button>
                        <Button
                            onClick={() =>
                                handleStatusChange(req.id, 'REJECTED')
                            }
                            variant="outline"
                            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 font-bold"
                        >
                            <XCircle className="w-4 h-4 mr-2" /> Відхилити
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
