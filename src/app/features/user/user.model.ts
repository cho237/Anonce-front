export interface User {
    id?: string;
    email: string;
    name: string;
    password?: string;
    role: UserRole;
}

export interface AuthReq {
    email: string;
    name?: string;
    password: string;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}
