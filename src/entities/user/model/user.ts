import { MatchStatusType } from '@/entities/matches';
import { ApplicationStatusType } from '@/entities/registration';
import { ITournament } from '@/entities/tournaments';

export interface IUser {
    id: string;
    email: string;
    name: string;
    username: string;
    role: Role;
    stats: IPlayerStats;
    organizationName?: string;
    createdAt: string;
    updatedAt: string;
    isApprovedOrganizer: boolean;
    organizerStatus: ApplicationStatusType;
    teams: {
        id: string;
        name: string;
        _count: {
            members: number;
        };
    }[];
    tournaments?: ITournament[];
    _count?: {
        tournaments: number;
    };
}

export enum Role {
    PLAYER = 'PLAYER',
    ADMIN = 'ADMIN',
    ORGANIZER = 'ORGANIZER',
}

export interface IPlayerStats {
    id: number;
    userId: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
}

export interface IProfile {
    profile: {
        id: string;
        name: string;
        username: string;
        role: Role;
        createdAt: string;
        isApprovedOrganizer: boolean;
        organization?: string | null;
    };
    statistics: IPlayerStats;
    teams: {
        id: string;
        name: string;
        _count: {
            members: number;
        };
    }[];
    history: {
        tournamentId: string;
        tournamentTitle: string;
        category: string;
        teamName: string;
        status: MatchStatusType;
    }[];
}
