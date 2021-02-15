import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPayload } from "@app/api-models";
import { IUserDTO } from "@app/api-models/user-dto.interface";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserDataService {
    constructor(private http: HttpClient){}

    public getUsers(): Observable<IPayload<IUserDTO[]>> {
        return this.http.get<IPayload<IUserDTO[]>>('http://localhost:3000/user/');
    }

    public getUserCount(): Observable<number> {
        return this.http.get<number>('http://localhost:3000/user/count');
    }

    public deleteUser(id: string): void {
        this.http.delete('http://localhost:3000/user/'+id);
    }
}