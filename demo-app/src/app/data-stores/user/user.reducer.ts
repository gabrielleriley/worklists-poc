import { loadablePagedEntityInitialState, LoadableEntityReducer } from '@app/data-stores/loadable-entity';
import { selectUserId, IUserEntity } from './user.entity';
import { UserAction } from './user.actions'
import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

const adapter = createEntityAdapter<IUserEntity >({ selectId: selectUserId });
const initialState = adapter.getInitialState({
    ...loadablePagedEntityInitialState,
});

export const userReducer = createReducer(
    initialState,
    on(UserAction.fetchPage, (state, props) => LoadableEntityReducer.onReadPageRequest({ state, props, adapter })),
    on(UserAction.fetchPageSuccess, (state, props) => LoadableEntityReducer.onReadPageSuccess({ state, props, adapter })),
    on(UserAction.fetchPageError, (state, props) => LoadableEntityReducer.onReadPageFailure({ state, props, adapter })),
    on(UserAction.deleteByKey, (state, props) => LoadableEntityReducer.onDeleteEntityByKeyRequestAction({ state, props, adapter })),
    on(UserAction.deleteByKeySuccess, (state, props) => LoadableEntityReducer.onDeleteEntityByKeySuccessAction({ state, props, adapter })),
    on(UserAction.deleteByKeyError, (state, props) => LoadableEntityReducer.onDeleteEntityByKeyFailureAction({ state, props, adapter }))
);
