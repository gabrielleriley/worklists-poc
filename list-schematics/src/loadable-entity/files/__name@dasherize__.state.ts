<% if(paginated) { %>import { ILoadablePagedEntityState } from '@app/data-stores/loadable-entity';<% } %>
<% if(!paginated) { %>import { ILoadableEntityState } from '@app/data-stores/loadable-entity';<% } %>
import { I<%= classify(name) %>Entity } from './<%= dasherize(name) %>.entity'

export const <%= camelize(name) %>StateName = '<%= dasherize(name) %>-loadable-state';

<% if(paginated) { %>export interface I<%= classify(name) %>EntityState extends ILoadablePagedEntityState<I<%= classify(name) %>Entity> { }

<% } if(!paginated) { %>export interface I<%= classify(name) %>EntityState extends ILoadableEntityState<I<%= classify(name) %>Entity> { }
<% } %>
