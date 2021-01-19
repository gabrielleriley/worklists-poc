import { Injectable } from "@angular/core";
import { IPersonRequestDTO } from '@app/api-models';
import { PersonHttpService } from '@app/api-services';
import { IAutoEntityService, IEntityInfo, IEntityWithPageInfo, Page } from '@briebug/ngrx-auto-entity';
import { forkJoin, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { personDtoToEntity } from './person-entity.mapper';
import { PersonAutoEntity } from './person.model';

@Injectable()
export class PersonEntityService implements IAutoEntityService<PersonAutoEntity> {
    constructor(private httpService: PersonHttpService) { }

    public loadPage(
        entityInfo: IEntityInfo,
        { page = 0, size = 10 }: Page,
        criteria: IPersonRequestDTO
    ): Observable<IEntityWithPageInfo<PersonAutoEntity>> {
        return forkJoin(
            this.httpService.search(page, size, criteria),
            this.httpService.count(criteria)
        ).pipe(
            map(([payload, count]) => ({
                pageInfo: {
                    page: { page, size },
                    totalCount: count,
                },
                entities: payload.data.map(personDtoToEntity)
            }))
        )
    }

    public deleteByKey(entityInfo: IEntityInfo, key: string): Observable<string> {
        return this.httpService.deleteById(key).pipe(
            mapTo(key)
        );
    }
}