import { MatchStatusType } from '@/entities/matches';
import { ApplicationStatusType } from '@/entities/registration';

export type TournamentFormat = 'SINGLE_ELIMINATION' | 'ROUND_ROBIN';

export type TournamentStatus =
    | 'PLANNED'
    | 'REGISTRATION'
    | 'ACTIVE'
    | 'FINISHED';

export const TOURNAMENT_STATUSES = {
    PLANNED: 'Заплановано',
    REGISTRATION: 'Реєстрація',
    ACTIVE: 'Активно',
    FINISHED: 'Завершено',
} as const;

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    minPlayers: number;
    maxPlayers: number;
}

export interface ISelectCategory {
    id: string;
    name: string;
}

export interface ITournamentRegistration {
    id: string;
    status: ApplicationStatusType;
    teamId: string;
    tournamentId: string;
    team: {
        ownerId: string;
        id: string;
        name: string;
    };
}

export interface ITournamentMatch {
    id: string;
    round: number;
    teamAId: string | null;
    teamBId: string | null;
    scoreA: number;
    scoreB: number;
    winnerId: string | null;
    status: MatchStatusType;
    nextMatchId: string | null;
    tournamentId: string;
}

export interface ITournament {
    id: string;
    title: string;
    description: string | null;
    format: TournamentFormat;
    status: TournamentStatus;
    maxTeams: number;
    startDate: string;
    categoryId: string;
    organizerId: string;
    createdAt: string;
    updatedAt: string;
    category: ICategory;

    registrations: ITournamentRegistration[];
    matches: ITournamentMatch[];

    _count?: {
        registrations: number;
    };
}
