import { ILoadablePagedEntityState } from '@app/data-stores/loadable-entity';
import { INationalityEntity } from './nationality.interface';

export const selectNationalityId = (entity: INationalityEntity) => entity.code;
export const NATIONALITY_STATE_NAME = 'Nationalities';
// For API-paged data
export interface INationalityEntityState extends ILoadablePagedEntityState<INationalityEntity> { }