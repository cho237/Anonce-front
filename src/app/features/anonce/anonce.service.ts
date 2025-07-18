import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Anonce, AnonceReader, ReadAnonces} from "./anonce.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class AnonceService {
    private baseUrl = environment.apiUrl;
    private apiUrl = this.baseUrl + '/anonces';

    constructor(private http: HttpClient) {
    }


    getAll(): Observable<Anonce[]> {
        return this.http.get<Anonce[]>(`${this.apiUrl}`,)
    }

    add(anonce: Anonce): Observable<Anonce> {
        return this.http.post<Anonce>(`${this.apiUrl}`, anonce)
    }

    markAsRead(anonceId: string): Observable<ReadAnonces[]> {
        return this.http.post<ReadAnonces[]>(`${this.apiUrl}/read/${anonceId}`, {})
    }

    readByUser():  Observable<ReadAnonces[]>  {
        return this.http.get<ReadAnonces[]>(`${this.apiUrl}/read-by-user`,)
    }

    readers(anonceId: string): Observable<AnonceReader[]> {
        return this.http.get<AnonceReader[]>(`${this.apiUrl}/readers`,)
    }

    details(anonceId: string): Observable<Anonce> {
        return this.http.get<Anonce>(`${this.apiUrl}/${anonceId}`,)
    }

    delete(anonceId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${anonceId}`,)
    }

}