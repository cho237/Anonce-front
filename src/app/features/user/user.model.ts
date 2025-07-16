export interface User {
    id?: number;
    email: string;
    name: string;
    password?: string;
}

export interface AuthReq {
    email: string;
    name?: string;
    password: string;
}