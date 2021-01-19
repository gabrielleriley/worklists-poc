import { loadablePagedEntityInitialState, LoadableEntityReducer } from '@app/data-stores/loadable-entity';
import { createEntityAdapter } from "@ngrx/entity";
import { createReducer, on } from '@ngrx/store';
import { deletePerson, deletePersonError, deletePersonSuccess, fetchPeople, fetchPeopleError, fetchPeopleSuccess } from './person-entity.actions';
import { IPersonEntity, selectPersonEntityId } from './person-entity.interface';

const adapter = createEntityAdapter<IPersonEntity>({ selectId: selectPersonEntityId });
const initialState = adapter.getInitialState({
    ...loadablePagedEntityInitialState
});

export const personReducer = createReducer(
    initialState,
    on(fetchPeople, (state, props) => LoadableEntityReducer.onReadPageRequest({ state, props, adapter })),
    on(fetchPeopleSuccess, (state, props) => LoadableEntityReducer.onReadPageSuccess({ state, props, adapter })),
    on(fetchPeopleError, (state, props) => LoadableEntityReducer.onReadPageFailure({ state, props, adapter })),
    on(deletePerson, (state, props) => LoadableEntityReducer.onDeleteEntityByKeyRequestAction({ state, props, adapter })),
    on(deletePersonSuccess, (state, props) => LoadableEntityReducer.onDeleteEntityByKeySuccessAction({ state, props, adapter })),
    on(deletePersonError, (state, props) => LoadableEntityReducer.onDeleteEntityByKeyFailureAction({ state, props, adapter }))
)
