export enum EntityActionType {
    Read,
    Create,
    Update,
    Patch,
    Delete,
    Action,
}

/**
 * Object to track the progress of an action workflow chain for the IEntityStatusState interface 
 */
export interface IEntityActionTimestamp {
    /**
     * Name of the asynchronous action workflow
     */
    actionName: string;
    /**
     * Asynchronous REST method type associated to action workflow chain
     */
    actionType: EntityActionType;
    timestamp: Date;
    /**
     * Entity ID directly involved in action workflow chain (example: deletion by Id)
     */
    entityId?: number | string;
    message?: string;
}

/**
 * Additional interface for NgRx Entity store to track the state of asynchronous action workflow chains through start to completion/failure
 */
export interface IEntityStatusState {
    completedActions: IEntityActionTimestamp[];
    inProgressActions: IEntityActionTimestamp[];
    failedActions: IEntityActionTimestamp[];
}
