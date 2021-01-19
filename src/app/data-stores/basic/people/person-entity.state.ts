import { ILoadablePagedEntityState } from '@app/data-stores/loadable-entity';
import { IPersonEntity } from './person-entity.interface';

export const PERSON_STATE_NAME = 'People';
export interface IPersonEntityState extends ILoadablePagedEntityState<IPersonEntity> { }
