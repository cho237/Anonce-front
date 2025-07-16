import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthReq, User} from "./user.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private baseUrl = environment.apiUrl;
    private apiUrl = this.baseUrl + 'users';

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}`);
    }

    signup(user: AuthReq): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/signup`, user);
    }

    signin(user: AuthReq): Observable<{ access_token: string }> {
        return this.http.post<{ access_token: string }>(`${this.baseUrl}/signin`, user);
    }


}