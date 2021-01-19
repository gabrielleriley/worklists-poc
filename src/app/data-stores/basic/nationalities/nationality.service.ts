import { IEntityService } from '@app/data-stores/loadable-entity/entity-service.interface';
import { INationalityEntity } from './nationality.interface';
import { NationalitiesHttpService } from '@app/api-services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPayload, INationalityDTO } from '@app/api-models';

@Injectable()
export class NationalityEntityService implements IEntityService<INationalityEntity> {
    constructor(private httpService: NationalitiesHttpService) { }

    loadAll(): Observable<INationalityEntity[]> {
        return this.httpService.getNationalities().pipe(
            map((payload: IPayload<INationalityDTO[]>) => payload.data)
        );
    }
}