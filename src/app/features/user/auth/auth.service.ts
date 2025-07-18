import { Injectable, signal } from '@angular/core';
import { AuthReq, User } from '../user.model';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = environment.apiUrl;
    private apiUrl = this.baseUrl + '/users/auth';

    // Replace BehaviorSubject with signal:
    private currentUserSignal = signal<User | null>(null);

    // Expose signal getter for components
    get currentUser() {
        return this.currentUserSignal;
    }

    constructor(private http: HttpClient) {}

    signup(user: AuthReq): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/signup`, user);
    }

    signin(user: AuthReq): Observable<any> {
        return this.http.post<{ access_token: string }>(`${this.apiUrl}/signin`, user, {
            withCredentials: true,
        }).pipe(
            switchMap(() => this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true })),
            tap((userData) => this.currentUserSignal.set(userData)),
        );
    }

    autoLogin(): void {
        this.http.get<User>(`${this.apiUrl}/me`, {
            withCredentials: true,
        }).pipe(
            tap((user) => this.currentUserSignal.set(user)),
            catchError(() => {
                this.currentUserSignal.set(null);
                return of(null);
            }),
        ).subscribe();
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`, {}, {
            withCredentials: true,
        }).pipe(
            tap(() => this.currentUserSignal.set(null)),
        );
    }

    isLoggedIn(): boolean {
        return !!this.currentUserSignal();
    }
}
