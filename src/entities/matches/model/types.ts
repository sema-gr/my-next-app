export interface Match {
    id: string;
    round: number;
    teamAId: string | null;
    teamBId: string | null;
    scoreA: number;
    scoreB: number;
    winnerId: string | null;
    status: MatchStatusType;
}

export interface IMatch {
    id: string;
    tournamentId: string;
    round: number;

    teamAId: string | null;
    teamBId: string | null;

    scoreA: number;
    scoreB: number;
    winnerId: string | null;

    status: MatchStatusType;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    tournament?: {
        id: string;
        title: string;
    };

    teamA?: {
        id: string;
        name: string;
    } | null;

    teamB?: {
        id: string;
        name: string;
    } | null;
}

export const MatchStatus = {
    SCHEDULED: 'SCHEDULED',
    FINISHED: 'FINISHED',
} as const;

export type MatchStatusType = (typeof MatchStatus)[keyof typeof MatchStatus];

export interface MatchesResponse {
    data: IMatch[];
    total: number;
}

export interface UseMatchesParams {
    page?: number;
    limit?: number;
    teamName?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}
