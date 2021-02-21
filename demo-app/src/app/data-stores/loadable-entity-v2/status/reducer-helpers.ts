import { IEntityActionTimestamp, ResourceMethod, IEntityStatusState } from './entity-action-timestamp.interface';
import { IEntityTimestampRemovalCriteria, IEntityTimestampRemoval } from './timestamp-removal-criteria.interface';

/**
 * Upserts timestamp into array. Timestamp matches are based upon action name, action type, and id.
 * @param timestamps - Either inProgressActions, completedActions, or failureActions
 * @param timestamp - New timestamp to be upserted
 */
export function upsertActionTimestamp(timestamps: IEntityActionTimestamp[], timestamp: IEntityActionTimestamp): IEntityActionTimestamp[] {
    const nonMatchingTimestamps = timestamps.filter((ts: IEntityActionTimestamp) =>
        ts.workflowName !== timestamp.workflowName
        || ts.resourceMethodType !== timestamp.resourceMethodType
        || ts.entityId !== timestamp.entityId
    );
    return [...nonMatchingTimestamps, timestamp];
}

/**
 * Removed timestamp from array with matching criteria
 * @param timestamps Array of in progress, completed, or failed action timestamps
 * @param removalCriteria - Removal criteria
 */
export function removeActionTimestamp(
    timestamps: IEntityActionTimestamp[],
    removalCriteria: IEntityTimestampRemoval
): IEntityActionTimestamp[] {
    return timestamps.filter((ts: IEntityActionTimestamp) => ts.workflowName !== removalCriteria.workflowName
        && ts.resourceMethodType !== removalCriteria.resourceMethodType
        && ts.entityId !== removalCriteria.entityId
    );
}

/**
 * Removes timestamps from array that match removal criteria
 * @param timestamps - Array of in progress, completed, or failed action timestamps
 * @param removalCriteria - Criteria of items to be removed. Only include properties that the array should be filtered based upon.
 */
export function removeActionTimestampByCriteria(
    timestamps: IEntityActionTimestamp[],
    removalCriteria: Partial<IEntityTimestampRemovalCriteria>
): IEntityActionTimestamp[] {
    return timestamps.filter((ts: IEntityActionTimestamp) =>
        !removalCriteria?.workflowNames?.length || removalCriteria.workflowNames.includes(ts.workflowName))
        .filter(ts => !removalCriteria?.resourceMethodTypes?.length || removalCriteria.resourceMethodTypes.includes(ts.resourceMethodType))
        .filter(ts => !removalCriteria?.entityIds?.length || removalCriteria.entityIds.includes(ts.entityId));
}

export function updateStatusesOnActionTrigger<State extends IEntityStatusState>(
    { state, actionName, actionType, entityId }:
        { state: State; actionName: string; actionType: ResourceMethod; entityId?: string | number; }
): State {
    return {
        ...state,
        inProgressActions: upsertActionTimestamp(state.inProgressActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId,
            timestamp: new Date()
        }),
    };
}

export function updateStatusesOnActionSuccess<State extends IEntityStatusState>(
    { state, actionName, actionType, entityId }:
        { state: State; actionName: string; actionType: ResourceMethod; entityId?: string | number; }
): State {
    return {
        ...state,
        inProgressActions: removeActionTimestamp(state.inProgressActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId
        }),
        failedActions: removeActionTimestamp(state.failedActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId
        }),
        completedActions: upsertActionTimestamp(state.completedActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId,
            timestamp: new Date()
        }),
    };
}

export function updateStatusOnActionFailure<State extends IEntityStatusState>(
    { state, actionName, actionType, entityId, errorMessage }:
        { state: State; actionName: string; actionType: ResourceMethod; entityId?: string | number; errorMessage?: string }
): State {
    return {
        ...state,
        inProgressActions: removeActionTimestamp(state.inProgressActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId
        }),
        completedActions: removeActionTimestamp(state.completedActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId
        }),
        failedActions: upsertActionTimestamp(state.failedActions, {
            workflowName: actionName,
            resourceMethodType: actionType,
            entityId,
            timestamp: new Date(),
            message: errorMessage
        })
    };
}
