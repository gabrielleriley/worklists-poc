import { Injectable } from '@angular/core';
import { IPersonDTO } from '@app/api-models';
import { PersonHttpService } from '@app/api-services';
import { IEntityErrorPayload, ILoadableEntityService, ILoadablePageInfo, IPagedPayload } from '@app/data-stores/loadable-entity';
import { forkJoin, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { IPersonEntity, IPersonEntityQueryCriteria } from './person-entity.interface';

@Injectable()
export class PersonEntityService implements ILoadableEntityService<IPersonEntity, IPersonEntityQueryCriteria> {
    constructor(private httpService: PersonHttpService) { }

    public loadPage(page: ILoadablePageInfo, criteria: IPersonEntityQueryCriteria): Observable<IPagedPayload<IPersonEntity> | IEntityErrorPayload> {
        return forkJoin(
            this.httpService.search(page.pageIndex, page.pageSize, criteria),
            this.httpService.count(criteria)
        ).pipe(
            map(([payload, count]) => payload.error ? { errorMessage: payload.error } : ({
                entities: payload.data.map(this.dtoToEntity),
                page,
                totalCount: count
            }))
        )
    }

    public deleteByKey(key: string): Observable<string> {
        return this.httpService.deleteById(key).pipe(
            mapTo(key)
        );
    }

    private dtoToEntity(dto: IPersonDTO) {
        return {
            id: dto.login.uuid,
            name: {
                first: dto.name.first,
                last: dto.name.last,
            },
            email: dto.email,
            gender: dto.gender,
            nationalityCode: dto.nat
        }
    }
}