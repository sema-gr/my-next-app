'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, Clock, RefreshCw, XCircle } from 'lucide-react';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    isRejected?: boolean;
    onResubmit?: () => void;
    isSubmitting?: boolean;
}

export function ApprovalModal({
    isOpen,
    onClose,
    isRejected = false,
    onResubmit,
    isSubmitting = false,
}: ApprovalModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-slate-900 relative overflow-hidden">
                <div
                    className={`absolute -top-10 -right-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-70 ${isRejected ? 'bg-red-100' : 'bg-yellow-100'}`}
                ></div>
                <div
                    className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-70 ${isRejected ? 'bg-orange-100' : 'bg-blue-100'}`}
                ></div>

                <div className="relative z-10 text-center">
                    <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 shadow-inner ${isRejected ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}
                    >
                        {isRejected ? (
                            <XCircle className="w-10 h-10 text-red-500" />
                        ) : (
                            <Clock className="w-10 h-10 text-yellow-500" />
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                        {isRejected
                            ? 'Заявку відхилено'
                            : 'Очікування перевірки'}
                    </h2>

                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        {isRejected
                            ? 'На жаль, адміністрація відхилила вашу попередню заявку на статус організатора. Якщо ви вважаєте, що це сталося помилково, надішліть запит ще раз.'
                            : 'Ваша заявка на отримання статусу організатора зараз знаходиться на розгляді адміністрації. Ви зможете створювати турніри одразу після підтвердження.'}
                    </p>

                    {!isRejected && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 flex items-start gap-3 text-left">
                            <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-slate-500 leading-snug">
                                Ми надішлемо вам сповіщення, як тільки ваш
                                акаунт буде перевірено та схвалено.
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-xl font-black text-slate-900 bg-white border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-1 active:shadow-none"
                        >
                            Зрозуміло
                        </button>

                        {onResubmit && (
                            <button
                                onClick={onResubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-xl font-black text-slate-500 bg-transparent border-2 border-transparent hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw
                                    className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`}
                                />
                                {isSubmitting
                                    ? 'Відправка...'
                                    : 'Надіслати запит ще раз'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
