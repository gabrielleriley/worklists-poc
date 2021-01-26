import { <% if(!paginated) { %>loadableEntityInitialState,<% } %><% if(paginated) { %>loadablePagedEntityInitialState,<% } %> LoadableEntityReducer } from '@app/data-stores/loadable-entity';
import { select<%= capitalize(name) %>Id, I<%= classify(name) %>Entity } from './<%= dasherize(name) %>.entity';
import { <%= classify(name) %>Action } from './<%= dasherize(name) %>.actions'
import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

const adapter = createEntityAdapter<I<%= classify(name) %>Entity >({ selectId: select<%= capitalize(name) %>Id });
const initialState = adapter.getInitialState({
    <% if(paginated) { %>...loadablePagedEntityInitialState,<% } %><% if(!paginated) { %>...loadableEntityInitialState,<% } %>
});

export const <%= camelize(name) %>Reducer = createReducer(
    initialState,<% if(read && paginated) { %>
    on(<%= classify(name) %>Action.fetchPage, (state, props) => LoadableEntityReducer.onReadPageRequest({ state, props, adapter })),
    on(<%= classify(name) %>Action.fetchPageSuccess, (state, props) => LoadableEntityReducer.onReadPageSuccess({ state, props, adapter })),
    on(<%= classify(name) %>Action.fetchPageError, (state, props) => LoadableEntityReducer.onReadPageFailure({ state, props, adapter })),<% } %><% if(read && !paginated) { %>
    on(<%= classify(name) %>Action.fetchAll, (state, props) => LoadableEntityReducer.onReadAllRequest({ state, props, adapter })),
    on(<%= classify(name) %>Action.fetchAllSuccess, (state, props) => LoadableEntityReducer.onReadAllSuccess({ state, props, adapter })),
    on(<%= classify(name) %>Action.fetchAllError, (state, props) => LoadableEntityReducer.onReadAllFailure({ state, props, adapter })),
    <% } %><% if(deleteByKey) {%>
    on(<%= classify(name) %>Action.deleteByKey, (state, props) => LoadableEntityReducer.onDeleteEntityByKeyRequestAction({ state, props, adapter })),
    on(<%= classify(name) %>Action.deleteByKeySuccess, (state, props) => LoadableEntityReducer.onDeleteEntityByKeySuccessAction({ state, props, adapter })),
    on(<%= classify(name) %>Action.deleteByKeyError, (state, props) => LoadableEntityReducer.onDeleteEntityByKeyFailureAction({ state, props, adapter }))<%}%>
);
