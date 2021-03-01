export enum EntityResourceMethod {
    Read,
    Create,
    Update,
    Patch,
    Delete,
    Action,
}

export interface IEntityTimestampDefinition {
    resourceMethodType: EntityResourceMethod;
    workflowName?: string;
    entityId?: number | string;
    message?: string;
}

/**
 * Object to track the progress of an action workflow chain for the IEntityStatusState interface
 */
export interface IEntityActionTimestamp extends IEntityTimestampDefinition {
    /**
     * Asynchronous REST method type associated to action workflow chain
     */
    resourceMethodType: EntityResourceMethod;
    timestamp: Date;
    /**
     * Name of the asynchronous action workflow
     */
    workflowName?: string;
    /**
     * Entity ID directly involved in action workflow chain (example: deletion by Id)
     */
    entityId?: number | string;
    message?: string;
}

/**
 * Additional interface for NgRx store to track the state of asynchronous action workflow chains through start to completion/failure
 */
export interface IEntityStatusState {
    completedActions: IEntityActionTimestamp[];
    inProgressActions: IEntityActionTimestamp[];
    failedActions: IEntityActionTimestamp[];
}

export interface IEntityPayload<T> {
    data: T;
    errorMessage?: string;
}
