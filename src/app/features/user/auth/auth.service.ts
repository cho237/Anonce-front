import {Injectable} from "@angular/core";
import {AuthReq, User} from "../user.model";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    constructor(private http: HttpClient) {}
    private baseUrl = environment.apiUrl;
    private apiUrl = this.baseUrl + '/users/auth';

    private currentUserSubject = new BehaviorSubject<any>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    signup(user: AuthReq): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/signup`, user);
    }

    signin(user: AuthReq): Observable<{ access_token: string }> {
        return this.http.post<{ access_token: string }>(`${this.apiUrl}/signin`, user,).pipe(
            tap(() => this.autoLogin())
        );
    }

    autoLogin(): void {
        this.http.get(`${this.apiUrl}/me`, {
            withCredentials: true,
        }).pipe(
            tap((user: any) => this.currentUserSubject.next(user)),
            catchError(() => {
                this.currentUserSubject.next(null);
                return of(null);
            })
        ).subscribe();
    }

    logout(): void {
        this.http.post(`${this.apiUrl}/logout`, {}, {
            withCredentials: true,
        }).subscribe(() => {
            this.currentUserSubject.next(null);
        });
    }
    isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}