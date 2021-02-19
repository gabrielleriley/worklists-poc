import { IEntityActionTimestamp, EntityActionType, IEntityStatusState } from './entity-action-timestamp.interface';
import { IEntityTimestampRemovalCriteria, IEntityTimestampRemoval } from './timestamp-removal-criteria.interface';

/**
 * Upserts timestamp into array. Timestamp matches are based upon action name, action type, and id.
 * @param timestamps - Either inProgressActions, completedActions, or failureActions
 * @param timestamp - New timestamp to be upserted
 */
export function upsertActionTimestamp(timestamps: IEntityActionTimestamp[], timestamp: IEntityActionTimestamp): IEntityActionTimestamp[] {
    const nonMatchingTimestamps = timestamps.filter(ts => ts.actionName !== timestamp.actionName
        && ts.actionType !== timestamp.actionType
        && ts.entityId !== timestamp.entityId
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
    return timestamps.filter((ts) => ts.actionName !== removalCriteria.actionName
        && ts.actionType !== removalCriteria.actionType
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
    return timestamps.filter(ts => !removalCriteria?.actionNames?.length || removalCriteria.actionNames.includes(ts.actionName))
        .filter(ts => !removalCriteria?.actionTypes?.length || removalCriteria.actionTypes.includes(ts.actionType))
        .filter(ts => !removalCriteria?.entityIds?.length || removalCriteria.entityIds.includes(ts.entityId));
}

export function updateStatusesOnActionTrigger(
    { state, actionName, actionType, entityId }:
        { state: IEntityStatusState; actionName: string; actionType: EntityActionType; entityId?: string | number; }
): IEntityStatusState {
    return {
        ...state,
        inProgressActions: upsertActionTimestamp(state.inProgressActions, {
            actionName,
            actionType,
            entityId,
            timestamp: new Date()
        }),
    };
}

export function updateStatusesOnActionSuccess(
    { state, actionName, actionType, entityId }:
        { state: IEntityStatusState; actionName: string; actionType: EntityActionType; entityId?: string | number; }
): IEntityStatusState {
    return {
        ...state,
        inProgressActions: removeActionTimestamp(state.inProgressActions, {
            actionName,
            actionType,
            entityId
        }),
        failedActions: removeActionTimestamp(state.failedActions, {
            actionName,
            actionType,
            entityId
        }),
        completedActions: upsertActionTimestamp(state.completedActions, {
            actionName,
            actionType,
            entityId,
            timestamp: new Date()
        })
    };
}

export function updateStatusOnActionFailure(
    { state, actionName, actionType, entityId, errorMessage }:
        { state: IEntityStatusState; actionName: string; actionType: EntityActionType; entityId?: string | number; errorMessage?: string }
): IEntityStatusState {
    return {
        ...state,
        inProgressActions: removeActionTimestamp(state.inProgressActions, {
            actionName,
            actionType,
            entityId
        }),
        completedActions: removeActionTimestamp(state.completedActions, {
            actionName,
            actionType,
            entityId
        }),
        failedActions: upsertActionTimestamp(state.failedActions, {
            actionName,
            actionType,
            entityId,
            timestamp: new Date(),
            message: errorMessage
        })
    };
}
