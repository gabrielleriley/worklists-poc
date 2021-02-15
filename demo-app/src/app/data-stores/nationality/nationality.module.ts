import { NgModule, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { nationalityStateName } from './nationality.state';
import { nationalityReducer } from './nationality.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NationalityEntityEffects, nationalityEffectsHelperToken } from './nationality.effects';
import { provideEntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { NationalityEntityService } from './nationality-entity.service';
import { NationalityFacade } from './nationality.facade';
import { selectNationalityId } from './nationality.entity';

const entity = new InjectionToken('Person');
@NgModule({
    imports: [
        StoreModule.forFeature(nationalityStateName, nationalityReducer),
        EffectsModule.forFeature([NationalityEntityEffects])
    ],
    providers: [
        NationalityEntityService,
        { provide: entity, useExisting: NationalityEntityService },
        provideEntityEffectsHelper(nationalityStateName, selectNationalityId, nationalityEffectsHelperToken, entity),
        NationalityFacade
    ]
})
export class NationalityEntityStateModule { }