import { LoadableEntityAction } from '@app/data-stores/loadable-entity';
import { IUserEntity } from './user.entity';
import { userStateName } from './user.state'

export namespace UserAction {
    export const {
        triggerAction: fetchPage,
        successAction: fetchPageSuccess,
        errorAction: fetchPageError
    } = LoadableEntityAction.makeReadPagedActions<IUserEntity>(userStateName);
    
    export const refetch = LoadableEntityAction.makeRefetchPageAction(userStateName)
    
    // TODO: change string | number to your entity's ID type
    export const {
        triggerAction: deleteByKey,
        successAction: deleteByKeySuccess,
        errorAction: deleteByKeyError
    } = LoadableEntityAction.makeDeleteByKeyActions<string | number>(userStateName);
}
