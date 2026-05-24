export const ApplicationStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export type ApplicationStatusType =
    (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export interface IRegistration {
    id: string;
    status: ApplicationStatusType;
    teamId: string;
    team: { name: string };
    createdAt: string;
}
