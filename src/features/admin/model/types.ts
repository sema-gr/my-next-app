export interface AdminStats {
    totalTeams: number;
    totalTournaments: number;
    totalMatches: number;
    pendingRequests: number;
}

export interface PendingOrganizer {
    id: string;
    name: string;
    username: string;
    email: string;
    organizationName: string | null;
}
