'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user.store';
import { Button, Card, CardContent } from '@/shared/ui';
import {
    Trophy,
    LayoutList,
    Users,
    CalendarDays,
    ArrowLeft,
    FileText,
    AlertCircle,
} from 'lucide-react';

import {
    useCreateTournament,
    createTournamentSchema,
    CreateTournamentInput,
    MAX_TEAMS,
} from '@/entities/tournaments';
import { useOrganizerGuard } from '@/shared/hooks';

export function CreateTournaments() {
    const { user, loading } = useUserStore();
    const router = useRouter();

    useOrganizerGuard(user, loading);

    const { categories, isLoading, onSubmit } = useCreateTournament();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTournamentInput>({
        resolver: zodResolver(createTournamentSchema),
        defaultValues: { maxTeams: 8 },
        mode: 'onChange',
    });

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Назад
            </button>

            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                Створити турнір
            </h1>

            <Card className="border-2 border-slate-100 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                        noValidate
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                                <Trophy className="w-4 h-4" /> Назва
                            </label>
                            <input
                                {...register('title')}
                                className="w-full h-12 rounded-xl border-2 border-slate-50 bg-slate-50 px-4 font-semibold focus:border-slate-900 outline-none transition-all"
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500 font-bold">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Опис турніру
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                placeholder="Додайте правила, формат або іншу важливу інформацію..."
                                className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 p-4 font-semibold focus:border-slate-900 outline-none transition-all resize-y min-h-[100px]"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 font-bold">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                                    <LayoutList className="w-4 h-4" /> Категорія
                                </label>
                                <select
                                    {...register('categoryId')}
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl border-2 border-slate-50 bg-slate-50 px-4 font-semibold focus:border-slate-900 outline-none cursor-pointer"
                                >
                                    <option value="">
                                        {isLoading
                                            ? 'Завантаження...'
                                            : 'Оберіть вид спорту'}
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="text-xs text-red-500 font-bold">
                                        {errors.categoryId.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Макс. команд
                                </label>
                                <select
                                    {...register('maxTeams', {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full h-12 rounded-xl border-2 border-slate-50 bg-slate-50 px-4 font-semibold focus:border-slate-900 outline-none cursor-pointer"
                                >
                                    {MAX_TEAMS.map((num) => (
                                        <option key={num} value={num}>
                                            {num} команд
                                        </option>
                                    ))}
                                </select>
                                {errors.maxTeams && (
                                    <p className="text-xs text-red-500 font-bold">
                                        {errors.maxTeams.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" /> Дата старту
                            </label>

                            <input
                                type="date"
                                min={todayStr}
                                {...register('startDate')}
                                className={`w-full h-12 rounded-xl border-2 px-4 font-semibold outline-none transition-all ${
                                    errors.startDate
                                        ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500'
                                        : 'border-slate-50 bg-slate-50 focus:border-slate-900'
                                }`}
                            />

                            {errors.startDate && (
                                <div className="flex items-start gap-2 mt-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300">
                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-600 font-bold leading-tight">
                                        {errors.startDate.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            {isSubmitting ? 'Публікація...' : 'Створити турнір'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
