import { PersonAutoEntity } from './person.model';
import { buildState, IEntityState } from '@briebug/ngrx-auto-entity';

export const { initialState, facade: PersonFacadeBase } = buildState(PersonAutoEntity);

// Stub reducer needed for AOT
export function personAutoReducer(state = initialState, action): IEntityState<PersonAutoEntity> {
    return state;
}