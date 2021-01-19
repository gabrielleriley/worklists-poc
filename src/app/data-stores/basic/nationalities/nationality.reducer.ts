import { loadableEntityInitialState, LoadableEntityReducer } from '@app/data-stores/loadable-entity';
import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { fetchNationalities, fetchNationalitiesSuccess } from './nationality.actions';
import { INationalityEntity } from './nationality.interface';
import { selectNationalityId } from './nationality.state';

const adapter = createEntityAdapter<INationalityEntity>({ selectId: selectNationalityId });
const initialState = adapter.getInitialState({
    ...loadableEntityInitialState
});

export const nationalityReducer = createReducer(
    initialState,
    on(fetchNationalities, (state, props) => LoadableEntityReducer.onReadAllRequest({ state, props, adapter })),
    on(fetchNationalitiesSuccess, (state, props) => LoadableEntityReducer.onReadAllSuccess({ state, props, adapter })),
    on(fetchNationalitiesSuccess, (state, props) => LoadableEntityReducer.onReadAllFailure({ state, props, adapter })),
);
