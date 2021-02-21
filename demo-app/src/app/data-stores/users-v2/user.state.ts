import { EntityState } from '@ngrx/entity';
import { IUserEntity, IUserQueryCriteria } from './user.entity';
import { IEntityPagedState } from '../loadable-entity-v2/paged';
import { IEntityStatusState } from '../loadable-entity-v2/status';

export const userStateName = 'user-loadable-state';

export interface IUserEntityState extends EntityState<IUserEntity>, IEntityStatusState, IEntityPagedState { 
    criteria: IUserQueryCriteria;
}

