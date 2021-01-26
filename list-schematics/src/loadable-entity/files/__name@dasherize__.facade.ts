import { Injectable } from "@angular/core";
import { <%= classify(name) %>Action } from './<%= dasherize(name) %>.actions';
import { select<%= capitalize(name) %>Id, I<%= classify(name) %>Entity <% if(queryParams) { %>,I<%= classify(name) %>QueryCriteria<% } %>} from './<%= dasherize(name) %>.entity';
import { <%= camelize(name) %>StateName } from './<%= dasherize(name) %>.state';
import { Store } from '@ngrx/store';
import { LoadableEntityFacade } from '@app/data-stores/loadable-entity';

<%if(deleteByKey) {%>// TODO: Change string| number to your entity ID's type
<% } %>
<%= createFacadeInterface({ name, queryParams, read, paginated, deleteByKey }) %>

<%= createBaseFacade({ name, queryParams, read, paginated, deleteByKey}) %>

@Injectable()
export class <%= classify(name) %>Facade extends <%= classify(name) %>FacadeBase {
    constructor(store: Store<any>) {
        super(store, <%= camelize(name) %>StateName);
    }
}
