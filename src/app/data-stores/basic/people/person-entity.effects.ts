import { Injectable, Inject } from "@angular/core";
import { PERSON_STATE_NAME } from './person-entity.state';
import { createEffectsHelperToken, EntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { IPersonEntity } from './person-entity.interface';
import { fetchPeople, fetchPeopleSuccess, fetchPeopleError, deletePerson, deletePersonSuccess, deletePersonError, refetchPeople } from './person-entity.actions';

export const personEffectsHelperToken = createEffectsHelperToken(PERSON_STATE_NAME);

@Injectable()
export class PersonEntityEffects {
    constructor(@Inject(personEffectsHelperToken) private helper: EntityEffectsHelper<IPersonEntity>) { }

    public load$ = this.helper.createEntityLoadPageEffect({
        triggerAction: fetchPeople,
        successAction: fetchPeopleSuccess,
        errorAction: fetchPeopleError
    });

    public deleteByKey$ = this.helper.createEntityDeleteByKeyEffect({
        triggerAction: deletePerson,
        successAction: deletePersonSuccess,
        errorAction: deletePersonError
    });

    public refetchPage$ = this.helper.createRefetchPageEffect([
        deletePersonSuccess,
        refetchPeople
    ], fetchPeople);
}