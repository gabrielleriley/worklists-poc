import { Injectable } from '@angular/core';
import { ILoadableEntityService } from '@app/data-stores/loadable-entity';
import {
    I<%= classify(name) %>Entity<% if(queryParams) { %>, I<%= classify(name) %>QueryCriteria <% } %>
} from './<%= dasherize(name) %>.entity';

// TODO: Implement me! All methods from the ILoadableEntityService are optional,
// but you must implement any methods that you have created actions for
@Injectable()
export class <%= classify(name) %>EntityService implements ILoadableEntityService<I<%= classify(name) %>Entity<%if(queryParams){%> ,I<%= classify(name) %>QueryCriteria<%}%>> {

}