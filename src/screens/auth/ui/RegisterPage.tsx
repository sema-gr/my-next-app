'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button, Card, CardContent, RoleSelect } from '@/shared/ui';
import { RegisterFormData, registerSchema, useRegister } from '@/entities/auth';
import { Role } from '@/entities/user';

export function RegisterPage() {
    const { registerUser } = useRegister();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: Role.PLAYER,
        },
    });

    const selectedRole = watch('role');
    const currentRole = watch('role');

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">Створити акаунт</h1>
                    <p className="text-slate-600 mt-2">
                        Приєднуйтесь до спортивної спільноти!
                    </p>
                </div>
                <Card className="rounded-2xl shadow-lg border-0">
                    <CardContent className="p-8">
                        <form
                            onSubmit={handleSubmit(registerUser)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Ім'я та Прізвище
                                </label>
                                <input
                                    {...register('name')}
                                    placeholder="Олег Савченко"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-950 outline-none"
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <RoleSelect
                                value={currentRole}
                                onChange={(newValue) => {
                                    setValue('role', newValue as any, {
                                        shouldValidate: true,
                                    });
                                }}
                                error={errors.role?.message}
                            />
                            {selectedRole === 'ORGANIZER' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <label className="text-sm font-medium">
                                        Назва організації
                                    </label>
                                    <input
                                        {...register('organizationName')}
                                        placeholder="Наприклад: НаУКМА чи КНУ"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-950 outline-none"
                                    />
                                    {errors.organizationName && (
                                        <p className="text-xs text-red-500">
                                            {errors.organizationName.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-950 outline-none"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Пароль
                                    </label>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-950 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Підтвердження
                                    </label>
                                    <input
                                        {...register('confirmPassword')}
                                        type="password"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-950 outline-none"
                                    />
                                </div>
                            </div>
                            {(errors.password || errors.confirmPassword) && (
                                <p className="text-xs text-red-500">
                                    {errors.password?.message ||
                                        errors.confirmPassword?.message}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 text-base mt-4"
                            >
                                {isSubmitting
                                    ? 'Створення...'
                                    : 'Створити профіль'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            <Link
                                href="/login"
                                className="hover:text-slate-900 transition-colors"
                            >
                                Вже маєте акаунт?{' '}
                                <span className="font-semibold underline">
                                    Увійти
                                </span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
