'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Button, Card, CardContent } from '@/shared/ui';
import { LoginFormData, loginSchema, useLogin } from '@/entities/auth';


export function LoginPage() {
    const { login } = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">SportTeam Platform</h1>
                    <p className="text-slate-600 mt-2">
                        Вітаємо знову! Увійдіть у свій акаунт
                    </p>
                </div>

                <Card className="rounded-2xl shadow-lg border-0">
                    <CardContent className="p-8">
                        <form
                            onSubmit={handleSubmit(login)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Пароль
                                </label>
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 text-base"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                {isSubmitting ? 'Вхід...' : 'Увійти'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-slate-600">
                                Немає акаунту?{' '}
                            </span>
                            <Link
                                href="/register"
                                className="font-semibold text-slate-900 hover:underline"
                            >
                                Зареєструватися
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-sm text-slate-500 hover:text-slate-800 transition"
                    >
                        ← Повернутися на головну
                    </Link>
                </div>
            </div>
        </div>
    );
}
