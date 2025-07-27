import { User } from "../../features/user/user.model";


export interface Vote {
    id?: string;
    title: string;
    description: string;
    image?: string;
    candidates: VoteCandidate[];
    active?: boolean;
}

export interface VoteListRes {
    voteData: Vote;
    userVote?: {
        id?: string;
        candidateId: string;
        voteId?: string;
        createdAt?: Date;
    }
}

export interface VoteCandidate {
    id?: string;
    name: string;
    description: string;
}

export interface VoteResponse<T> {
    success: boolean;
    data?: T;
    message?: string[] | string;
    statusCode: number;
}

export interface VoteResult{
    id?: string;
    name: string;
    count: number;
}

export interface Voter{
    id?: string;
    user: User;
    candidate: VoteCandidate,
    createdAt: Date;
}