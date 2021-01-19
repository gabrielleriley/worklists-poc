import { NgModule, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { PERSON_STATE_NAME } from './person-entity.state';
import { personReducer } from './person-entity.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PersonEntityEffects, personEffectsHelperToken } from './person-entity.effects';
import { provideEntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { selectPersonEntityId } from './person-entity.interface';
import { PersonEntityService } from './person-entity.service';
import { PersonFacade } from './person-entity.facade';

const entity = new InjectionToken('Person');
@NgModule({
    imports: [
        StoreModule.forFeature(PERSON_STATE_NAME, personReducer),
        EffectsModule.forFeature([PersonEntityEffects])
    ],
    providers: [
        PersonEntityService,
        { provide: entity, useExisting: PersonEntityService },
        provideEntityEffectsHelper(PERSON_STATE_NAME, selectPersonEntityId, personEffectsHelperToken, entity),
        PersonFacade
    ]
})
export class PersonEntityStateModule { }