
import { ILoadableEntityState } from '@app/data-stores/loadable-entity';
import { INationalityEntity } from './nationality.entity'

export const nationalityStateName = 'nationality-loadable-state';

export interface INationalityEntityState extends ILoadableEntityState<INationalityEntity> { }

