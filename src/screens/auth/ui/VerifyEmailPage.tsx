'use client';

import Link from 'next/link';
import { Card, CardContent, Button } from '@/shared/ui';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore, useOtpInput, useVerifyEmail } from '@/entities/auth';

export function VerifyEmailPage() {
    const email = useAuthStore((state) => state.registrationEmail);
    const { verifyCode, isLoading, isSuccess } = useVerifyEmail();
    const {
        code,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        fullCode,
        isComplete,
    } = useOtpInput(6);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyCode(email, fullCode);
    };

    if (!email && !isSuccess) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">
                        Електронну пошту не знайдено
                    </h2>
                    <Link href="/register">
                        <Button>Повернутися до реєстрації</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Підтвердження
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Ми надіслали 6-значний код на <br />
                        <span className="text-slate-900 font-bold">
                            {email}
                        </span>
                    </p>
                </div>

                <Card className="rounded-3xl shadow-xl border-0 overflow-hidden">
                    <CardContent className="p-8">
                        {isSuccess ? (
                            <div className="flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Акаунт активовано!
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    Ви успішно підтвердили свою пошту.
                                </p>
                                <Link
                                    href="/login"
                                    className="w-full mt-4 block"
                                >
                                    <Button className="w-full h-12 text-base font-bold rounded-xl">
                                        Увійти в акаунт{' '}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="flex justify-center gap-2 sm:gap-4">
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                inputRefs.current[index] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(index, e)
                                            }
                                            onPaste={handlePaste}
                                            disabled={isLoading}
                                            className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 outline-none transition-all disabled:opacity-50"
                                        />
                                    ))}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !isComplete}
                                    className="w-full h-14 text-lg font-bold rounded-xl bg-slate-900 hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Перевірка...
                                        </>
                                    ) : (
                                        'Підтвердити код'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {!isSuccess && (
                    <div className="mt-8 text-center">
                        <Link
                            href="/register"
                            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            ← Повернутися до реєстрації
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
