import { IEntityActionTimestamp, IEntityStatusState, IEntityTimestampDefinition } from './entity-action-timestamp.interface';

/**
 * Adds timestamp into array.
 * @param timestamps Array of in progress, completed, or failed action timestamps
 * @param timestamp - New timestamp to be upserted
 */
export function addActionTimestamp(timestamps: IEntityActionTimestamp[], timestamp: IEntityTimestampDefinition): IEntityActionTimestamp[] {
    return [...timestamps, { ...timestamp, timestamp: new Date() }];
}
/**
 * Upserts timestamp into array. Timestamp matches are based upon action name, action type, and id.
 * @param timestamps Array of in progress, completed, or failed action timestamps
 * @param timestamp - New timestamp to be upserted
 */
export function upsertActionTimestamp(
    timestamps: IEntityActionTimestamp[],
    timestamp: IEntityTimestampDefinition
): IEntityActionTimestamp[] {
    const nonMatchingTimestamps = timestamps.filter((ts: IEntityActionTimestamp) =>
        ts.workflowName !== timestamp.workflowName
        || ts.resourceMethodType !== timestamp.resourceMethodType
        || ts.entityId !== timestamp.entityId
    );
    return [...nonMatchingTimestamps, { ...timestamp, timestamp: new Date() }];
}

/**
 * Removes single timestamp from array with matching resource method type, workflow name, entity id
 * @param timestamps Array of in progress, completed, or failed action timestamps
 * @param removalCriteria - Removal criteria
 */
export function removeActionTimestamp(
    timestamps: IEntityActionTimestamp[],
    removalCriteria: IEntityTimestampDefinition
): IEntityActionTimestamp[] {
    const matchingIndex = timestamps.findIndex((ts: IEntityActionTimestamp) => ts.workflowName === removalCriteria.workflowName
        && ts.resourceMethodType === removalCriteria.resourceMethodType
        && ts.entityId === removalCriteria.entityId
    );
    return timestamps.filter((_ts, index: number) => index !== matchingIndex);
}

/**
 * Upserts action status to inProgressActions array.
 * Use this function when the associated effect uses a switchMap.
 */
export function updateStatusStateOnCancelableTrigger<State extends IEntityStatusState>(
    definition: IEntityTimestampDefinition,
    state: State
): State {
    return {
        ...state,
        inProgressActions: upsertActionTimestamp(state.inProgressActions, definition),
    };
}

/**
 * Adds action status to inProgressActions array.
 * Use this function when the associated effect does not use a switchMap.
 */
export function updateStatusStateOnTrigger<State extends IEntityStatusState>(
    definition: IEntityTimestampDefinition,
    state: State
): State {
    return {
        ...state,
        inProgressActions: addActionTimestamp(state.inProgressActions, definition),
    };
}

export function updateStatusStateOnSuccess<State extends IEntityStatusState>(
    definition: IEntityTimestampDefinition,
    state: State
): State {
    return {
        ...state,
        inProgressActions: removeActionTimestamp(state.inProgressActions, definition),
        failedActions: removeActionTimestamp(state.failedActions, definition),
        completedActions: upsertActionTimestamp(state.completedActions, definition),
    };
}

export function updateStatusStateOnFailure<State extends IEntityStatusState>(
    definition: IEntityTimestampDefinition,
    state: State
): State {
    return {
        ...state,
        inProgressActions: removeActionTimestamp(state.inProgressActions, definition),
        completedActions: removeActionTimestamp(state.completedActions, definition),
        failedActions: upsertActionTimestamp(state.failedActions, definition)
    };
}
