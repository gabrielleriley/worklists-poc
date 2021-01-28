import { ILoadablePagedEntityState } from '@app/data-stores/loadable-entity';

import { IUserEntity } from './user.entity'

export const userStateName = 'user-loadable-state';

export interface IUserEntityState extends ILoadablePagedEntityState<IUserEntity> { }


