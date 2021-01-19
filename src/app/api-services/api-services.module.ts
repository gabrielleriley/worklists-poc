import { NgModule } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { NationalitiesHttpService } from './nationalities-http.service';
import { PersonHttpService } from './person-http.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        NationalitiesHttpService,
        PersonHttpService
    ]
})
export class ApiServicesModule { }