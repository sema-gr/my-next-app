import { ReactNode } from 'react';
import { IRegistration } from '@/entities/registration';
import { CheckCircle2, XCircle } from 'lucide-react';

interface RegistrationCardProps {
    registration: IRegistration;
    actionSlot?: ReactNode;
}

export function RegistrationCard({
    registration,
    actionSlot,
}: RegistrationCardProps) {
    return (
        <div className="bg-white border-2 border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors">
            <div>
                <h3 className="font-black text-slate-900 text-lg">
                    {registration.team.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                    Подано:{' '}
                    {new Date(registration.createdAt).toLocaleDateString(
                        'uk-UA'
                    )}
                </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                {registration.status === 'PENDING' ? (
                    actionSlot
                ) : (
                    <span
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                            registration.status === 'APPROVED'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-red-50 text-red-600'
                        }`}
                    >
                        {registration.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        {registration.status === 'APPROVED'
                            ? 'Схвалено'
                            : 'Відхилено'}
                    </span>
                )}
            </div>
        </div>
    );
}
