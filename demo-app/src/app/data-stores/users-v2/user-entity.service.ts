import { Injectable } from '@angular/core';
import { IUserDTO, IUserRequestDTO, UserSortColumnDTO } from '@app/api-models';
import { UserHttpService } from '@app/api-services/user-http.service';
import { forkJoin, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { ILoadablePageInfo } from '../loadable-entity-v2/paged';
import { IUserEntity, IUserQueryCriteria } from './user.entity';

@Injectable({ providedIn: 'root' })
export class UserEntityService {
    constructor(private httpService: UserHttpService) { }

    public loadPage(page: ILoadablePageInfo, criteria: IUserQueryCriteria) {
        return forkJoin([
            this.httpService.search(page.pageIndex, page.pageSize, this.convertToDtoQuery(criteria)),
            this.httpService.count(this.convertToDtoQuery(criteria))
        ]).pipe(
            map(([payload, count]) => payload.error ? { errorMessage: payload.error } : ({
                entities: payload.data.map(this.dtoToEntity),
                page,
                totalCount: count
            }))
        );
    }

    public deleteByKey(key: string): Observable<string> {
        return this.httpService.deleteById(key).pipe(
            mapTo(key)
        );
    }

    private dtoToEntity(dto: IUserDTO): IUserEntity {
        return {
            id: dto.id,
            name: {
                first: dto.name.first,
                last: dto.name.last,
            },
            email: dto.email,
            gender: dto.gender,
            nationalityCode: dto.nationality
        };
    }

    private convertToDtoQuery(entityQuery: IUserQueryCriteria): IUserRequestDTO {
        return ({
            nationalities: entityQuery.nationalities,
            genders: entityQuery.genders,
            lastName: entityQuery.lastName,
            sortColumn: entityQuery.sortColumn as UserSortColumnDTO,
            order: entityQuery.direction as any,
        });
    }
}
