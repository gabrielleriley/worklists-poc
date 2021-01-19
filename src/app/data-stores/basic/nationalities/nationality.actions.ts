import { INationalityEntity } from './nationality.interface';

import { NATIONALITY_STATE_NAME } from './nationality.state';
import { LoadableEntityAction } from '@app/data-stores/loadable-entity';

export const {
    triggerAction: fetchNationalities,
    successAction: fetchNationalitiesSuccess,
    errorAction: fetchNationalitiesError
} = LoadableEntityAction.makeReadAllActions<INationalityEntity>(NATIONALITY_STATE_NAME);