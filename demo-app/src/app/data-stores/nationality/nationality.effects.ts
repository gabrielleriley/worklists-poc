import { Injectable, Inject } from "@angular/core";
import { createEffectsHelperToken, EntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { INationalityEntity } from './nationality.entity';
import { nationalityStateName } from './nationality.state';
import { NationalityAction } from './nationality.actions';

export const nationalityEffectsHelperToken = createEffectsHelperToken(nationalityStateName);

@Injectable()
export class NationalityEntityEffects {
    constructor(@Inject(nationalityEffectsHelperToken) private helper: EntityEffectsHelper<INationalityEntity>) { }
    
    public load$ = this.helper.createEntityLoadAllEffect({
        triggerAction: NationalityAction.fetchAll,
        successAction: NationalityAction.fetchAllSuccess,
        errorAction: NationalityAction.fetchAllError
    });
    
    public refetch$ = this.helper.createRefetchAllEffect([
        NationalityAction.refetch
    ], NationalityAction.fetchAll);
}