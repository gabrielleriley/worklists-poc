import { IEntityStatusState } from '../loadable-entity-v2/status/entity-action-timestamp.interface';
import { EntityState } from '@ngrx/entity';
import { IUserEntity } from './user.entity';

export const userStateName = 'user-loadable-state';

export interface IUserEntityState extends EntityState<IUserEntity>, IEntityStatusState { }

