// Оголошуємо тип для вхідних даних
interface TournamentData {
    id: string;
    name: string;
    status: string;
    startDate: string;
}

// Заглушка утиліти з явно вказаним типом (tournament: TournamentData)
const formatTournamentDataForUI = (tournament: TournamentData) => {
    return {
        ...tournament,
        displayTitle: tournament.name.toUpperCase(),
        isRegistrationOpen: tournament.status === 'REGISTRATION_OPEN',
        formattedDate: new Date(tournament.startDate).toLocaleDateString(
            'uk-UA'
        ),
    };
};

describe('Frontend Utils: Data Formatting for Next.js UI', () => {
    const rawApiData: TournamentData = {
        id: 't-123',
        name: 'літній кубок',
        status: 'REGISTRATION_OPEN',
        startDate: '2026-06-01T10:00:00Z',
    };

    it('повинен коректно перетворювати назву турніру у верхній регістр для заголовка сторінки', () => {
        const result = formatTournamentDataForUI(rawApiData);
        expect(result.displayTitle).toBe('ЛІТНІЙ КУБОК');
    });

    it('повинен правильно визначати логічний прапорець (boolean) для відкриття форми реєстрації', () => {
        const result = formatTournamentDataForUI(rawApiData);
        expect(result.isRegistrationOpen).toBe(true);
    });

    it('повинен коректно локалізувати дату початку турніру (формат uk-UA)', () => {
        const result = formatTournamentDataForUI(rawApiData);
        expect(result.formattedDate).toMatch(/0?1\.0?6\.2026/);
    });
});
