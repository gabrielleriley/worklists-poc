import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPayload } from "@app/api-models";
import { IUserDTO } from "@app/api-models/user-dto.interface";
import { IUserQueryParams } from "@app/api-models/user-query-params.interface";
import { Observable } from "rxjs";
import { HttpParams} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class UserDataService {
    constructor(private http: HttpClient){}

    public getUsers(filterParams: IUserQueryParams): Observable<IPayload<IUserDTO[]>> {

        let params = new HttpParams();
        // params = params.append('firstName', filterParams.firstName);
        // params = params.append('email', filterParams.email);

        if (filterParams.genders != '') {
            params = params.append('genders', filterParams.genders);   
        }
        
        if (filterParams.lastName != '') {
            params = params.append('lastName', filterParams.lastName);
        }

        if (filterParams.nationalites.length > 0) {
            params = params.append('nationalities', filterParams.nationalites.join(","));
        }

        if (filterParams.sortColumn && filterParams.sortColumn != '') {
            params = params.append('sortColumn', filterParams.sortColumn);
        }

        if (filterParams.order && filterParams.order != '') {
            params = params.append('order', filterParams.order);
        }

        if (filterParams.page.toString() != '') {
            params = params.append('page', filterParams.page.toString());
        }

        if (filterParams.size.toString() != '') {
            params = params.append('size', filterParams.size.toString());
        }

        return this.http.get<IPayload<IUserDTO[]>>('http://localhost:3000/user/', {params: params});
    }

    public getUserCount(filterParams: IUserQueryParams): Observable<number> {
        let params = new HttpParams();

        if (filterParams.genders != '') {
            params = params.append('genders', filterParams.genders);   
        }
        
        if (filterParams.lastName != '') {
            params = params.append('lastName', filterParams.lastName);
        }

        if (filterParams.nationalites.length > 0) {
            params = params.append('nationalities', filterParams.nationalites.join(","));
        }

        return this.http.get<number>('http://localhost:3000/user/count', {params: params});
    }

    public deleteUser(id: string): void {
        this.http.delete('http://localhost:3000/user/'+id);
    }
}