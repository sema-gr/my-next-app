import { ApplicationStatusType } from '@/entities/registration';
import { ITeam } from '@/entities/teams';

export interface IPlayerResult {
    id: string;
    name: string;
    username: string;
}

export interface ITeamRegistration {
    id: string;
    status: ApplicationStatusType;
    tournamentId: string;
    tournament: { title: string };
    createdAt: string;
}

export interface IJoinRequest {
    id: string;
    status: ApplicationStatusType;
    createdAt: string;
    user: {
        id: string;
        name: string;
        username: string;
    };
}

export interface TeamsResponse {
    data: ITeam[];
    total: number;
}

export interface UseTeamsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isRecruiting?: string;
    ownerName?: string;
    sortBy?: string | undefined;
}
