export type NotificationType =
    | 'INFO'
    | 'SUCCESS'
    | 'WARNING'
    | 'ERROR'
    | 'TEAM_JOIN_REQUEST'
    | 'TOURNAMENT_UPDATE';

export interface INotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string | null;
    isRead: boolean;
    createdAt: string;
}
