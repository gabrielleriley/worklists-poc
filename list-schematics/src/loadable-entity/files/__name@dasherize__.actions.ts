import { LoadableEntityAction } from '@app/data-stores/loadable-entity';
import { I<%= classify(name) %>Entity } from './<%= dasherize(name) %>.entity';
import { <%= camelize(name) %>StateName } from './<%= dasherize(name) %>.state'

export namespace <%= getActionNamespace(name) %> {
    <%= createActions({ name, read, paginated, deleteByKey }) %>
}
