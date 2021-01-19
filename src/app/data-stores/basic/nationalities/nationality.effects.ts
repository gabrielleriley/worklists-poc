import { createEffectsHelperToken, EntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { Injectable, Inject } from '@angular/core';
import { INationalityEntity } from './nationality.interface';
import { NATIONALITY_STATE_NAME } from './nationality.state';
import { fetchNationalities, fetchNationalitiesSuccess, fetchNationalitiesError } from './nationality.actions';

export const nationalityEffectsHelperToken = createEffectsHelperToken(NATIONALITY_STATE_NAME);

@Injectable()
export class NationalityEntityEffects {
    constructor(@Inject(nationalityEffectsHelperToken) private helper: EntityEffectsHelper<INationalityEntity>) { }

    public load$ = this.helper.createEntityLoadAllEffect({
        triggerAction: fetchNationalities,
        successAction: fetchNationalitiesSuccess,
        errorAction: fetchNationalitiesError
    });
}