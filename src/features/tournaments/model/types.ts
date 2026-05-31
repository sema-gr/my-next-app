import { ITournament } from '@/entities/tournaments';

export interface TournamentsResponse {
    data: ITournament[];
    total: number;
}

export interface UseTournamentsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
    maxTeams?: string;
    dateFrom?: string;
    dateTo?: string;
}