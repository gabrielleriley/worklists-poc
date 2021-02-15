import { Injectable } from '@angular/core';
import { IPayload, IUserDTO } from '@app/api-models';
import { UserDataService } from '@app/api-services/user-data-service';
import { ILoadableEntityService, ILoadablePageInfo, IPagedPayload } from '@app/data-stores/loadable-entity';
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
        return forkJoin([this.dataService.getUsers(),this.dataService.getUserCount()]).pipe(
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
}