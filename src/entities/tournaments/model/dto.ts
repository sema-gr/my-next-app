import z from 'zod';

export const MAX_TEAMS = [2, 4, 8, 16, 32];

export const createTournamentSchema = z.object({
    title: z.string().min(3, 'Назва має містити мінімум 3 символи'),

    categoryId: z.string().min(1, 'Оберіть категорію'),

    maxTeams: z.number().refine((val) => MAX_TEAMS.includes(val), {
        message: 'Кількість команд має бути 2, 4, 8, 16 або 32 ',
    }),

    description: z.string().optional(),

    startDate: z
        .string()
        .min(1, 'Оберіть дату')
        .refine(
            (dateStr) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(dateStr);
                return selectedDate >= today;
            },
            { message: 'Значення має бути сьогоднішнім або більш пізнім' }
        ),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;

export function getTournamentStatus(status: string) {
    switch (status) {
        case 'PLANNED':
            return {
                label: 'Заплановано',
                color: 'bg-blue-100 text-blue-700',
            };
        case 'REGISTRATION':
            return {
                label: 'Реєстрація відкрита',
                color: 'bg-green-100 text-green-700',
            };
        case 'ACTIVE':
            return {
                label: 'Триває',
                color: 'bg-orange-100 text-orange-700',
            };
        case 'FINISHED':
            return {
                label: 'Завершено',
                color: 'bg-slate-200 text-slate-700',
            };
        default:
            return {
                label: status,
                color: 'bg-slate-100 text-slate-700',
            };
    }
}

export const SPORTS = [
    { value: 'FOOTBALL', label: 'Футбол' },
    { value: 'BASKETBALL', label: 'Баскетбол' },
    { value: 'VOLLEYBALL', label: 'Волейбол' },
    { value: 'TENNIS', label: 'Теніс' },
    { value: 'ESPORTS', label: 'Кіберспорт' },
];

export const MAX_TEAMS_OPTIONS = [
    { value: '2', label: 'До 2 команд' },
    { value: '4', label: 'До 4 команд' },
    { value: '8', label: 'До 8 команд' },
    { value: '16', label: 'До 16 команд' },
    { value: '32', label: 'До 32 команд' },
];
