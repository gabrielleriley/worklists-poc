import { LoadableEntityAction } from '@app/data-stores/loadable-entity';
import { INationalityEntity } from './nationality.entity';
import { nationalityStateName } from './nationality.state'

export namespace NationalityAction {
    export const {
        triggerAction: fetchAll,
        successAction: fetchAllSuccess,
        errorAction: fetchAllError
    } = LoadableEntityAction.makeReadAllActions<INationalityEntity>(nationalityStateName);
    
    export const refetch = LoadableEntityAction.makeRefetchPageAction(nationalityStateName)
}
