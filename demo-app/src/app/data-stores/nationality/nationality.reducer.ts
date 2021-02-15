import { loadableEntityInitialState, LoadableEntityReducer } from '@app/data-stores/loadable-entity';
import { selectNationalityId, INationalityEntity } from './nationality.entity';
import { NationalityAction } from './nationality.actions'
import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

const adapter = createEntityAdapter<INationalityEntity >({ selectId: selectNationalityId });
const initialState = adapter.getInitialState({
    ...loadableEntityInitialState,
});

export const nationalityReducer = createReducer(
    initialState,
    on(NationalityAction.fetchAll, (state, props) => LoadableEntityReducer.onReadAllRequest({ state, props, adapter })),
    on(NationalityAction.fetchAllSuccess, (state, props) => LoadableEntityReducer.onReadAllSuccess({ state, props, adapter })),
    on(NationalityAction.fetchAllError, (state, props) => LoadableEntityReducer.onReadAllFailure({ state, props, adapter })),
    
);
