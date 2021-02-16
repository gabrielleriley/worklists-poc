import { Injectable } from '@angular/core';
import { IPayload, IUserDTO } from '@app/api-models';
import { IUserQueryParams } from '@app/api-models/user-query-params.interface';
import { UserDataService } from '@app/api-services/user-data-service';
import { IEntityErrorPayload, ILoadableEntityService, ILoadablePageInfo, IPagedPayload, LoadableEntityTypeKey } from '@app/data-stores/loadable-entity';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    IUserEntity, IUserQueryCriteria 
} from './user.entity';

// TODO: Implement me! All methods from the ILoadableEntityService are optional,
// but you must implement any methods that you have created actions for
@Injectable()
export class UserEntityService implements ILoadableEntityService<IUserEntity ,IUserQueryCriteria> {
    constructor(private dataService: UserDataService) {}

    loadPage(pageInfo: ILoadablePageInfo, criteria: IUserQueryCriteria): Observable<IPagedPayload<IUserEntity>> {
        return forkJoin([this.dataService.getUsers(this.mapCriteriaToParams(criteria,pageInfo)),this.dataService.getUserCount(this.mapCriteriaToParams(criteria,pageInfo))]).pipe(
            map(([users, userCount]) => {
                console.log('entity service: ', users);
                return {
                    entities: this.createUserData(users),
                    page: pageInfo,
                    totalCount: userCount
                }
            })
        ) 
    }

    mapCriteriaToParams(criteria: IUserQueryCriteria, pageInfo: ILoadablePageInfo): IUserQueryParams {
        return {
            lastName: criteria.lastName,
            genders: criteria.gender,
            nationalites: criteria.nationalities,
            sortColumn: criteria.sortColumn,
            order: criteria.direction,
            page: pageInfo.pageIndex,
            size: pageInfo.pageSize
        } 
    }

    createUserData(payload: IPayload<IUserDTO[]>): IUserEntity[] {
        return payload.data.map(user => {
            return { 
                id: user.id,     
                gender: user.gender,
                name: {
                    title: user.name.title,
                    first: user.name.first,
                    last: user.name.last,
                },
                dob: user.dob,
                email: user.email,
                nationality: user.nationality, 
            }
        })
    }

    // deleteByKey?(key: LoadableEntityTypeKey): Observable<LoadableEntityTypeKey | IEntityErrorPayload>;

    deleteByKey(userId: LoadableEntityTypeKey): Observable<LoadableEntityTypeKey | IEntityErrorPayload> {
        return this.dataService.deleteUser('userId').pipe(
            map(() => userId)
        )
    }
}