import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { INationalityDTO, IPayload } from '../api-models';

/**
 * HTTP service modeled after non-paginated data sets, which are often used to populate select filters in worklists (ex: users, practices)
 */
@Injectable({ providedIn: 'root' })
export class NationalitiesHttpService {
    constructor(private http: HttpClient) { }
    public getNationalities(): Observable<IPayload<INationalityDTO[]>> {
        return this.http.get<IPayload<INationalityDTO[]>>('http://localhost:3000/nationality');
    }
}