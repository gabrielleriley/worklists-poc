import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { INationalityDTO } from "@app/api-models/nationality-dto.interface";
import { Observable } from "rxjs";

Injectable({ providedIn: 'root' })
export class NationalityDataService {
    constructor(private http: HttpClient){}

    public getNationalities(): Observable<INationalityDTO[]> {
        return this.http.get<INationalityDTO[]>('http://localhost:3000/nationality');
    }
}