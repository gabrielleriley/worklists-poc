import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPayload } from "@app/api-models";
import { INationalityDTO } from "@app/api-models/nationality-dto.interface";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NationalityDataService {
    constructor(private http: HttpClient){}

    public getNationalities(): Observable<IPayload<INationalityDTO[]>> {
        return this.http.get<IPayload<INationalityDTO[]>>('http://localhost:3000/nationality');
    }
}