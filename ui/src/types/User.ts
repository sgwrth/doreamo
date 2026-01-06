export interface User {
    username: string,
    roles: string[],
    token: string,
    refreshToken: string,
}