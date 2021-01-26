import { NgModule, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { <%= camelize(name) %>StateName } from './<%= dasherize(name) %>.state';
import { <%= camelize(name) %>Reducer } from './<%= dasherize(name) %>.reducer';
import { EffectsModule } from '@ngrx/effects';
import { <%= classify(name) %>EntityEffects, <%= camelize(name) %>EffectsHelperToken } from './<%= dasherize(name) %>.effects';
import { provideEntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { <%= classify(name) %>EntityService } from './<%= dasherize(name) %>-entity.service';
import { <%= classify(name) %>Facade } from './<%= dasherize(name) %>.facade';
import { select<%= capitalize(name) %>Id } from './<%= dasherize(name) %>.entity';

const entity = new InjectionToken('Person');
@NgModule({
    imports: [
        StoreModule.forFeature(<%= camelize(name) %>StateName, <%= camelize(name) %>Reducer),
        EffectsModule.forFeature([<%= classify(name) %>EntityEffects])
    ],
    providers: [
        <%= classify(name) %>EntityService,
        { provide: entity, useExisting: <%= classify(name) %>EntityService },
        provideEntityEffectsHelper(<%= camelize(name) %>StateName, select<%= capitalize(name) %>Id, <%= camelize(name) %>EffectsHelperToken, entity),
        <%= classify(name) %>Facade
    ]
})
export class <%= classify(name) %>EntityStateModule { }