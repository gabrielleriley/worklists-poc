export namespace ActionCreators {
    export const namespaceName = `LoadableEntityAction`;
    export const makeCreateActions = `${namespaceName}.makeCreateActions`;
    export const makeReadAllActions = `${namespaceName}.makeReadAllActions`;
    export const makePageReadActions = `${namespaceName}.makeReadPagedActions`;
    export const makeUpdateActions = `${namespaceName}.makeUpdateActions`;
    export const makePatchActions = `${namespaceName}.makePatchActions`;
    export const makeDeleteActions = `${namespaceName}.makeDeleteActions`;
    export const makeDeleteByKeyActions = `${namespaceName}.makeDeleteByKeyActions`;
    export const makeCustomActions = `${namespaceName}.makeCustomActions`;
    export const makeRefetchAllAction = `${namespaceName}.makeRefetchAllAction`;
    export const makeRefetchPageAction = `${namespaceName}.makeRefetchPageAction`;
}

export enum ActionTypes {
    Create = 'create',
    ReadAll = 'fetchAll',
    ReadPaged = 'fetchPage',
    Update = 'update',
    Patch = 'patch',
    Delete = 'delete',
    DeleteByKey = 'deleteByKey',
    Refetch = 'refetch'
}

export enum ActionState {
    Trigger = '',
    Success = 'Success',
    Error = 'Error'
}