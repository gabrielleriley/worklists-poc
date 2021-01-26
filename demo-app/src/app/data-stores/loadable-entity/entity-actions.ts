import { createAction, props } from '@ngrx/store';
import { ILoadablePageInfo, LoadableEntityTypeKey } from './entity-state.interface';
import { LoadableAction } from './loadable-action.enum';


// TODO: split out request and response prop interfaces
export interface ILoadableActionProps<Payload, Criteria = {}> {
    loadableActionType: LoadableAction;
    payload?: Payload;
    criteria?: Partial<Criteria>;
    nonCrudActionTypeName?: string;
    // Below only used for responses:
    errorMessage?: string;
    identity?: LoadableEntityTypeKey;
}

export interface ILoadablePagedActionProps<Payload, Criteria = {}> extends ILoadableActionProps<Payload, Criteria> {
    page: ILoadablePageInfo;
    totalEntitiesCount?: number;
}

// ACTION FACTORIES
function generateLoadableEntityActions<EntityType, Criteria = {}>(entityName: string, type: LoadableAction) {
    return {
        triggerAction: createAction(`[${entityName}] START - ${type}`, props<ILoadableActionProps<EntityType, Criteria>>()),
        errorAction: createAction(`[${entityName}] ERROR - ${type}`, props<ILoadableActionProps<EntityType, Criteria>>()),
        successAction: createAction(`[${entityName}] SUCCESS - ${type}`, props<ILoadableActionProps<EntityType, Criteria>>())
    }
}

function generateLoadablePagedEntityActions<EntityType, Criteria>(entityName: string, type: LoadableAction) {
    return {
        triggerAction: createAction(`[${entityName}] START - ${type}`, props<ILoadablePagedActionProps<EntityType, Criteria>>()),
        errorAction: createAction(`[${entityName}] ERROR - ${type}`, props<ILoadablePagedActionProps<EntityType, Criteria>>()),
        successAction: createAction(`[${entityName}] SUCCESS - ${type}`, props<ILoadablePagedActionProps<EntityType, Criteria>>())
    }
}

export namespace LoadableEntityAction {
    export const makeCreateActions = <EntityType>(entityName: string) => generateLoadableEntityActions<EntityType>(entityName, LoadableAction.Create);
    export const makeReadAllActions = <EntityType, Criteria = {}>(entityName: string) => generateLoadableEntityActions<EntityType[], Criteria>(entityName, LoadableAction.ReadAll);
    export const makeReadPagedActions = <EntityType, Criteria = {}>(entityName: string) => generateLoadablePagedEntityActions<EntityType[], Criteria>(entityName, LoadableAction.ReadPage);
    
    export const makeUpdateActions = <EntityType>(entityName: string) => generateLoadableEntityActions<EntityType>(entityName, LoadableAction.Update);
    export const makePatchActions = <EntityType>(entityName: string) => generateLoadableEntityActions<Partial<EntityType>>(entityName, LoadableAction.Patch);
    export const makeDeleteActions = <EntityType>(entityName: string) => generateLoadableEntityActions<EntityType>(entityName, LoadableAction.DeleteEntity);
    export const makeDeleteByKeyActions = <Key extends LoadableEntityTypeKey>(entityName: string) => ({
        triggerAction: createAction(`[${entityName}] START - ${LoadableAction.DeleteByKey}`, props<ILoadableActionProps<Key>>()),
        errorAction: createAction(`[${entityName}] ERROR - ${LoadableAction.DeleteByKey}`, props<ILoadableActionProps<Key>>()),
        successAction: createAction(`[${entityName}] SUCCESS - ${LoadableAction.DeleteByKey}`, props<ILoadableActionProps<Key>>())
    });
    export function makeCustomActions<RequestType, ResponseType>(entityName: string, customActionName: string) {
        const type = LoadableAction.CustomAction;
        return {
            triggerAction: createAction(`[${entityName}: ${customActionName}] START - ${type}`, props<ILoadableActionProps<RequestType>>()),
            errorAction: createAction(`[${entityName}: ${customActionName}] ERROR - ${type}`, props<ILoadableActionProps<ResponseType>>()),
            successAction: createAction(`[${entityName}: ${customActionName}] SUCCESS - ${type}`, props<ILoadableActionProps<ResponseType>>())
        }
    }
    export function makeRefetchAllAction(entityName: string) { return createAction(`[${entityName}] Refetch All Entities`); }
    export function makeRefetchPageAction(entityName: string) { return createAction(`[${entityName}] Refetch Paged Entities`); }
}
