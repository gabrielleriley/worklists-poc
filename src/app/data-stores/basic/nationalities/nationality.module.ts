import { InjectionToken, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NationalityEntityEffects, nationalityEffectsHelperToken } from './nationality.effects';
import { nationalityReducer } from './nationality.reducer';
import { NATIONALITY_STATE_NAME, selectNationalityId } from './nationality.state';
import { NationalityEntityService } from './nationality.service';
import { provideEntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { NationalityFacade } from './nationality.facade';

const entity = new InjectionToken('Nationality');
@NgModule({
    imports: [
        StoreModule.forFeature(NATIONALITY_STATE_NAME, nationalityReducer),
        EffectsModule.forFeature([NationalityEntityEffects])
    ],
    providers: [
        NationalityEntityService,
        { provide: entity, useExisting: NationalityEntityService },
        provideEntityEffectsHelper(NATIONALITY_STATE_NAME, selectNationalityId, nationalityEffectsHelperToken, entity),
        NationalityFacade
    ]
})
export class NationalityEntityModule { }