import { Injectable } from '@angular/core';
import { NationalityDataService } from '@app/api-services/nationality-data-service';
import { ILoadableEntityService } from '@app/data-stores/loadable-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    INationalityEntity
} from './nationality.entity';

// TODO: Implement me! All methods from the ILoadableEntityService are optional,
// but you must implement any methods that you have created actions for
@Injectable()
export class NationalityEntityService implements ILoadableEntityService<INationalityEntity> {
    constructor(private dataService: NationalityDataService){}

    loadAll(): Observable<INationalityEntity[]> {
        return this.dataService.getNationalities().pipe(
            map(payload => {
                return payload.data.map(nationality => {
                    return { id: nationality.code, name: nationality.name }
                })
            })
        )    
    }
}