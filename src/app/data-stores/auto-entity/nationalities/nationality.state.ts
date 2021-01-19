import { buildState, IEntityState } from '@briebug/ngrx-auto-entity';
import { NationalityAutoEntity } from './nationality.model';

export const { initialState, facade: NationalityFacadeBase } = buildState(NationalityAutoEntity);

// Stub reducer needed for AOT
export function nationalityAutoReducer(state = initialState): IEntityState<NationalityAutoEntity> {
    return state;
}