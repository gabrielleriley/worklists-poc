import { Injectable } from '@angular/core';
import { ILoadableEntityService } from '@app/data-stores/loadable-entity';
import { IUserEntity, IUserQueryCriteria } from './user.entity';

@Injectable()
export class UserEntityService implements ILoadableEntityService<IUserEntity, IUserQueryCriteria> {

}