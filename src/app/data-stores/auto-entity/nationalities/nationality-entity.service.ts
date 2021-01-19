import { Injectable } from '@angular/core';
import { IAutoEntityService, IEntityInfo } from '@briebug/ngrx-auto-entity';
import { NationalityAutoEntity } from './nationality.model';
import { Observable } from 'rxjs';
import { NationalitiesHttpService } from '@app/api-services';
import { IPayload, INationalityDTO } from '@app/api-models';
import { map } from 'rxjs/operators';

@Injectable()
export class NationalityEntityService implements IAutoEntityService<NationalityAutoEntity> {
    constructor(private httpService: NationalitiesHttpService) { }

    loadAll(entityInfo: IEntityInfo): Observable<NationalityAutoEntity[]> {
        return this.httpService.getNationalities().pipe(
            map((payload: IPayload<INationalityDTO[]>) => payload.data)
        );
    }
}