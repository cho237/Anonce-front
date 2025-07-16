export interface Vote {
    id?: string;
    title: string;
    description: string;
    image?: string;
    candidates: VoteCandidate[];
    active?: boolean;
}

export interface VoteCandidate {
    id?: string;
    name: string;
    description: string;
}

export interface VoteResponse<T> {
    success: boolean;
    data: T;
    message?: string[];
    statusCode: number;
}

