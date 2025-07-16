import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Vote, VoteResponse} from "./vote.model";

@Injectable({
    providedIn: 'root',
})
export class AnonceService {
    private baseUrl = environment.apiUrl;
    private apiUrl = this.baseUrl + 'anonces';

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<VoteResponse<Vote[]>> {
        return this.http.get<VoteResponse<Vote[]>>(`${this.apiUrl}`,)
    }

    add(vote: Vote): Observable<VoteResponse<Vote>> {
        return this.http.post<VoteResponse<Vote>>(`${this.apiUrl}`, vote)
    }


}