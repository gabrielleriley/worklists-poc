import { Injectable } from '@angular/core';
import { INationalityDTO, IPayload } from '@app/api-models';
import { NationalitiesHttpService } from '@app/api-services';
import { ILoadableEntityService } from '@app/data-stores/loadable-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INationalityEntity } from './nationality.entity';

@Injectable()
export class NationalityEntityService implements ILoadableEntityService<INationalityEntity> {
    constructor(private httpService: NationalitiesHttpService) { }

    loadAll(): Observable<INationalityEntity[]> {
        return this.httpService.getNationalities().pipe(
            map((payload: IPayload<INationalityDTO[]>) => payload.data.map(p => ({ id: p.code, name: p.name })))
        );
    }
}