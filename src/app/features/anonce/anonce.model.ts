import {User} from "../user/user.model";

export interface Anonce {
    id?: string;
    title: string;
    content: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface AnonceReader {
    id: string;
    user: User;
}

export interface ReadAnonces {
    id: string;
    anonce?: Anonce;
}