import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPayload, IUserDTO, IUserRequestDTO } from '@app/api-models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserHttpService {
    constructor(private http: HttpClient) { }

    public search(page: number, size: number, request: IUserRequestDTO): Observable<IPayload<IUserDTO[]>> {
        let params = new HttpParams()
            .append('page', page.toString())
            .append('size', size.toString());
        if (request.genders) {
            params = params.append('genders', request.genders?.join(','));
        }
        if (request.nationalities) {
            params = params.append('nationalities', request.nationalities?.join(','));
        }
        if (request.lastName) {
            params = params.append('lastName', request.lastName ?? '');
        }
        if (request.sortColumn) {
            params = params = params.append('sortColumn', request.sortColumn)
                .append('order', request.order ?? '');
        }
        return this.http.get<IPayload<IUserDTO[]>>('http://localhost:3000/user', { params });
    }

    public count(request: IUserRequestDTO): Observable<number> {
        let params = new HttpParams();
        if (request.genders) {
            params = params.append('genders', request.genders?.join(','));
        }
        if (request.nationalities) {
            params = params.append('nationalities', request.nationalities?.join(','));
        }
        if (request.lastName) {
            params = params.append('lastName', request.lastName ?? '');
        }
        return this.http.get<number>('http://localhost:3000/user/count', { params });
    }

    public deleteById(id: string): Observable<void> {
        return this.http.delete(`http://localhost:3000/user/${id}`).pipe(
            map(() => undefined)
        );
    }
}
