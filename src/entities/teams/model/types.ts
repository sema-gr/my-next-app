import { Match } from "@/entities/matches";

export interface ITeam {
    id: string;
    name: string;
    ownerId: string;
    owner: { name: string };
    _count: { members: number };
}

export interface TeamInfo {
    id: string;
    name: string;
}

export interface ITeamDetails {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    owner: { id: string; name: string; username: string };
    members: {
        id: string;
        user: {
            id: string;
            name: string;
            username: string;
            stats?: { gamesPlayed: number; wins: number };
        };
    }[];
    matchesA: Match[];
    matchesB: Match[];
}
