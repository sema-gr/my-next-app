import { ApplicationStatusType } from '@/entities/registration';

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