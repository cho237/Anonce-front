import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Vote, VoteListRes, Voter, VoteResponse, VoteResult} from "./vote.model";

@Injectable({
    providedIn: 'root',
})
export class VoteService {
    private baseUrl = environment.apiUrl;
    private apiUrl = this.baseUrl + '/votes';

    constructor(private http: HttpClient) {
    }

    getAll(isActive: boolean): Observable<VoteResponse<VoteListRes[]>> {
        return this.http.get<VoteResponse<VoteListRes[]>>(`${this.apiUrl}?isActive=${isActive}`,)
    }

    add(vote: Vote): Observable<VoteResponse<Vote>> {
        return this.http.post<VoteResponse<Vote>>(`${this.apiUrl}`, vote)
    }

    cast(voteId: string, candidateId:string, password:string): Observable<VoteResponse<Vote>> {
        return this.http.post<VoteResponse<Vote>>(`${this.apiUrl}/voter`, {voteId, candidateId, password})
    }

    results(voteId: string): Observable<VoteResponse<VoteResult[]>> {
        return this.http.get<VoteResponse<VoteResult[]>>(`${this.apiUrl}/${voteId}/results`,)
    }

    voters(voteId: string): Observable<VoteResponse<Voter[]>> {
        return this.http.get<VoteResponse<Voter[]>>(`${this.apiUrl}/${voteId}/voters`,)
    }

    activate(voteId: string, isActive: boolean): Observable<VoteResponse<Vote>> {
        return this.http.patch<VoteResponse<Vote>>(`${this.apiUrl}`,{voteId, isActive})
    }


}