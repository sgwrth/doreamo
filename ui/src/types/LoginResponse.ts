export interface LoginResponse {
    token: string,
    roles: string[],
    refreshToken: string,
};