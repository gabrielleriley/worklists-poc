import { Injectable, Inject } from "@angular/core";
import { createEffectsHelperToken, EntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { I<%= classify(name) %>Entity } from './<%= dasherize(name) %>.entity';
import { <%= camelize(name) %>StateName } from './<%= dasherize(name) %>.state';
import { <%= classify(name) %>Action } from './<%= dasherize(name) %>.actions';

export const <%= camelize(name) %>EffectsHelperToken = createEffectsHelperToken(<%= camelize(name) %>StateName);

@Injectable()
export class <%= classify(name) %>EntityEffects {
    constructor(@Inject(<%= camelize(name) %>EffectsHelperToken) private helper: EntityEffectsHelper<I<%= classify(name) %>Entity>) { }
    
    <%= createEffect({ name, read, paginated, deleteByKey }) %>
}