import { EntityAdapter } from '@ngrx/entity';
import { ILoadableActionProps, ILoadablePagedActionProps } from './entity-actions';
import { ILoadableActionErrorTimestamp, ILoadableActionTimestamp, ILoadableEntityState, ILoadablePagedEntityState, LoadableEntityTypeKey } from './entity-state.interface';
import { LoadableAction } from './loadable-action.enum';

// TODO: the adapter input is likely not necessary
interface IReadArgs<T> {
    state: ILoadableEntityState<T>;
    props: ILoadableActionProps<T[]>;
    adapter: EntityAdapter<T>
}
interface IReadPageArgs<T> {
    state: ILoadablePagedEntityState<T>;
    props: ILoadablePagedActionProps<T[], any>;
    adapter: EntityAdapter<T>;
}
interface IActionArgs<T, Payload> {
    state: ILoadableEntityState<T>;
    props: ILoadableActionProps<Payload>;
    adapter: EntityAdapter<T>
}

export namespace LoadableEntityReducer {
    // READ Actions
    /**
     * Patches the API criteria property, marks the state as loading
     * @param args State, Action Payload, and Entity State Adapter
     */
    export function onReadAllRequest<T>(args: IReadArgs<T>): ILoadableEntityState<T, any> {
        const timestamp = { loadableActionType: LoadableAction.ReadAll };
        return {
            ...args.state,
            criteria: args.props.criteria ? { ...args.state.criteria, ...args.props.criteria } : { ...args.state.criteria },
            inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, true),
        };
    }

    /**
     * Patches the API criteria and currentPage properties, 
     * marks the state as loading
     * @param args State, Action Payload, and Entity State Adapter
     */
    export function onReadPageRequest<T>(args: IReadPageArgs<T>): ILoadablePagedEntityState<T, any> {
        const timestamp = { loadableActionType: LoadableAction.ReadPage };
        return {
            ...args.state,
            criteria: args.props.criteria ? { ...args.state.criteria, ...args.props.criteria } : { ...args.state.criteria },
            currentPage: { ...args.state.currentPage, ...args.props.page },
            inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, true),
        }
    }

    /**
     * Replaces entity collection in the state, marks the process as completed,
     * and removes any previous load failures
     * @param args State, Action Payload, and Entity State Adapter
     */
    export function onReadAllSuccess<T>(args: IReadArgs<T>): ILoadableEntityState<T, any> {
        const timestamp = { loadableActionType: LoadableAction.ReadAll };
        return {
            ...args.adapter.setAll(args.props.payload, args.state),
            totalEntitiesCount: args.props.payload.length,
            inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
            completedActions: updateStatusArray(args.state.completedActions, timestamp, true),
            failedActions: updateStatusArray(args.state.failedActions, timestamp, false),
        }
    }

    /**
     * Replaces entity collection with newly loaded page, marks the process as completed, and removes any previous load failures
     * @param args State, Action Payload, and Entity State Adapter
     */
    export function onReadPageSuccess<T>(args: IReadPageArgs<T>): ILoadablePagedEntityState<T, any> {
        const timestamp = { loadableActionType: LoadableAction.ReadPage };
        return {
            ...args.adapter.setAll(args.props.payload, args.state),
            totalEntitiesCount: args.props.totalEntitiesCount,
            inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
            completedActions: updateStatusArray(args.state.completedActions, timestamp, true),
            failedActions: updateStatusArray(args.state.failedActions, timestamp, false),
        }
    }

    /**
     * Removes all entities from state, 
     * @param args State, Action Payload, and Entity State Adapter
     */
    export function onReadAllFailure<T>(args: IReadArgs<T>): ILoadableEntityState<T, any> {
        const timestamp = { loadableActionType: LoadableAction.ReadAll, message: args.props.errorMessage };
        return {
            ...args.state,
            inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
            completedActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
            failedActions: updateErrorStatusArray(args.state.failedActions, timestamp, true),
        }
    }

    /**
     * 
     * @param args State, Action Payload, and Entity State Adapter
     */
    export function onReadPageFailure<T>(args: IReadArgs<T>): ILoadableEntityState<T, any> {
        const timestamp = { loadableActionType: LoadableAction.ReadPage, message: args.props.errorMessage };
        return {
            ...args.state,
            inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
            completedActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
            failedActions: updateErrorStatusArray(args.state.failedActions, timestamp, true),
        }
    }

    // CREATE actions
    export const onCreateRequestAction = <T>(args: IActionArgs<T, T>) => onActionTrigger(args, {
        loadableActionType: LoadableAction.Create,
    });

    export const onCreateSuccessAction = <T>(args: IActionArgs<T, T>) => onActionSuccess(args, {
        loadableActionType: LoadableAction.Create,
    });

    export const onCreateFailureAction = <T>(args: IActionArgs<T, T>) => onActionFailure(args, {
        loadableActionType: LoadableAction.Create,
        message: args.props.errorMessage
    });

    // UPDATE actions
    export const onUpdateRequestAction = <T>(args: IActionArgs<T, T>) => onActionTrigger(args, {
        loadableActionType: LoadableAction.Update,
        identity: args.props.payload[args.adapter.selectId(args.props.payload)]
    });

    export const onUpdateSuccessAction = <T>(args: IActionArgs<T, T>) => onActionSuccess(args, {
        loadableActionType: LoadableAction.Update,
        identity: args.props.payload[args.adapter.selectId(args.props.payload)]
    });

    export const onUpdateFailureAction = <T>(args: IActionArgs<T, T>) => onActionFailure(args, {
        loadableActionType: LoadableAction.Update,
        identity: args.props.payload[args.adapter.selectId(args.props.payload)],
        message: args.props.errorMessage
    });

    // DELETE by Entity actions
    export const onDeleteEntityRequestAction = <T>(args: IActionArgs<T, T>) => onActionTrigger(args, {
        loadableActionType: LoadableAction.DeleteEntity,
        identity: args.props.payload[args.adapter.selectId(args.props.payload)]
    });

    export const onDeleteEntitySuccessAction = <T>(args: IActionArgs<T, T>) => onActionSuccess(args, {
        loadableActionType: LoadableAction.DeleteEntity,
        identity: args.props.payload[args.adapter.selectId(args.props.payload)]
    });

    export const onDeleteEntityFailureAction = <T>(args: IActionArgs<T, T>) => onActionFailure(args, {
        loadableActionType: LoadableAction.DeleteEntity,
        identity: args.props.payload[args.adapter.selectId(args.props.payload)],
        message: args.props.errorMessage
    });

    // DELETE by Key actions
    export const onDeleteEntityByKeyRequestAction = <T, Key extends LoadableEntityTypeKey>(args: IActionArgs<T, Key>) => onActionTrigger(args, {
        loadableActionType: LoadableAction.DeleteByKey,
        identity: args.props.identity
    });

    export const onDeleteEntityByKeySuccessAction = <T, Key extends LoadableEntityTypeKey>(args: IActionArgs<T, Key>) => onActionSuccess(args, {
        loadableActionType: LoadableAction.DeleteByKey,
        identity: args.props.identity
    });

    export const onDeleteEntityByKeyFailureAction = <T, Key extends LoadableEntityTypeKey>(args: IActionArgs<T, Key>) => onActionFailure(args, {
        loadableActionType: LoadableAction.DeleteByKey,
        identity: args.props.identity,
        message: args.props.errorMessage
    });

    // PATCH actions
    export const onPatchEntityRequestAction = <T>(args: IActionArgs<T, Partial<T>>) => onActionTrigger(args, {
        loadableActionType: LoadableAction.Patch,
        identity: args.props.payload[args.adapter.selectId(args.props.payload as T)]
    });

    export const onPatchEntitySuccessAction = <T>(args: IActionArgs<T, Partial<T>>) => onActionSuccess(args, {
        loadableActionType: LoadableAction.Patch,
        identity: args.props.payload[args.adapter.selectId(args.props.payload as T)]
    });

    export const onPatchEntityFailureAction = <T>(args: IActionArgs<T, Partial<T>>) => onActionFailure(args, {
        loadableActionType: LoadableAction.Patch,
        identity: args.props.payload[args.adapter.selectId(args.props.payload as T)],
        message: args.props.errorMessage
    });

    // Custom Actions
    export const onCustomActionRequestAction = <T>(args: IActionArgs<T, Partial<T>>) => onActionTrigger(args, {
        loadableActionType: LoadableAction.CustomAction,
        nonCrudActionTypeName: args.props.nonCrudActionTypeName
    });

    export const onCustomActionSuccessAction = <T>(args: IActionArgs<T, Partial<T>>) => onActionSuccess(args, {
        loadableActionType: LoadableAction.CustomAction,
        nonCrudActionTypeName: args.props.nonCrudActionTypeName
    });

    export const onCustomActionFailureAction = <T>(args: IActionArgs<T, Partial<T>>) => onActionFailure(args, {
        loadableActionType: LoadableAction.CustomAction,
        nonCrudActionTypeName: args.props.nonCrudActionTypeName,
        message: args.props.errorMessage
    });
}



interface TimestampFinder {
    loadableActionType: LoadableAction;
    identity?: number | string;
    nonCrudActionTypeName?: string;
    message?: string;
}
const typeMatch = (ip: ILoadableActionTimestamp, search: TimestampFinder) => ip.loadableActionType === search.loadableActionType;
const customActionNameMatch = (ip: ILoadableActionTimestamp, search: TimestampFinder) => !search.nonCrudActionTypeName || search.nonCrudActionTypeName === ip.nonCrudActionTypeName;
const identityMatch = (ip: ILoadableActionTimestamp, search: TimestampFinder) => !search.identity || search.identity === ip.identity;

function updateStatusArray(inProgress: ILoadableActionTimestamp[], timestamp: TimestampFinder, add: boolean) {
    inProgress = [
        ...inProgress.filter((ip) => !typeMatch(ip, timestamp) || !customActionNameMatch(ip, timestamp) || !identityMatch(ip, timestamp))
    ]
    if (add) {
        inProgress = [
            ...inProgress,
            {
                loadableActionType: timestamp.loadableActionType,
                timestamp: new Date(),
                identity: timestamp.identity,
                nonCrudActionTypeName: timestamp.nonCrudActionTypeName
            }
        ]
    }
    return inProgress;
}

function updateErrorStatusArray(inProgress: ILoadableActionErrorTimestamp[], timestamp: TimestampFinder, add: boolean) {
    inProgress = [
        ...inProgress.filter((ip) => !typeMatch(ip, timestamp) || !customActionNameMatch(ip, timestamp) || !identityMatch(ip, timestamp))
    ]
    if (add) {
        inProgress = [
            ...inProgress,
            {
                loadableActionType: timestamp.loadableActionType,
                timestamp: new Date(),
                identity: timestamp.identity,
                nonCrudActionTypeName: timestamp.nonCrudActionTypeName,
                errorMessage: timestamp.message
            }
        ]
    }
    return inProgress;
}

function onActionTrigger<T, Payload>(args: IActionArgs<T, Payload>, timestamp: TimestampFinder): ILoadableEntityState<T, any> {
    return {
        ...args.state,
        inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, true),
    }
}

function onActionSuccess<T, Payload>(args: IActionArgs<T, Payload>, timestamp: TimestampFinder): ILoadableEntityState<T, any> {
    return {
        ...args.state,
        inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
        completedActions: updateStatusArray(args.state.completedActions, timestamp, true),
        failedActions: updateStatusArray(args.state.failedActions, timestamp, false),
    }
}

function onActionFailure<T, Payload>(args: IActionArgs<T, Payload>, timestamp: TimestampFinder): ILoadableEntityState<T, any> {
    return {
        ...args.state,
        inProgressActions: updateStatusArray(args.state.inProgressActions, timestamp, false),
        completedActions: updateStatusArray(args.state.completedActions, timestamp, false),
        failedActions: updateStatusArray(args.state.failedActions, timestamp, true),
    }
}