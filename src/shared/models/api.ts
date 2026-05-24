export interface AuthResponse {
    status: string;
    message?: string;
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
        };
    };
}
