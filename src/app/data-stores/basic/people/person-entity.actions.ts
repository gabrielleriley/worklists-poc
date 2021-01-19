import { IPersonEntity, IPersonEntityQueryCriteria } from './person-entity.interface';
import { PERSON_STATE_NAME } from './person-entity.state';
import { LoadableEntityAction } from '@app/data-stores/loadable-entity';

export const {
    triggerAction: fetchPeople,
    successAction: fetchPeopleSuccess,
    errorAction: fetchPeopleError
} = LoadableEntityAction.makeReadPagedActions<IPersonEntity, IPersonEntityQueryCriteria>(PERSON_STATE_NAME);

export const { 
    triggerAction: deletePerson,
    successAction: deletePersonSuccess,
    errorAction: deletePersonError
} = LoadableEntityAction.makeDeleteByKeyActions<string>(PERSON_STATE_NAME);
export const refetchPeople = LoadableEntityAction.makeRefetchPageAction(PERSON_STATE_NAME);
