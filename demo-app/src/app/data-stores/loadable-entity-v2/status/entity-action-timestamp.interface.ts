export enum EntityActionType {
    Read,
    Create,
    Update,
    Patch,
    Delete,
    Action,
}

export interface IEntityActionTimestamp {
    actionName: string;
    actionType: EntityActionType;
    timestamp: Date;
    entityId?: number | string;
    message?: string;
}

export interface IEntityStatusState {
    completedActions: IEntityActionTimestamp[];
    inProgressActions: IEntityActionTimestamp[];
    failedActions: IEntityActionTimestamp[];
}

export const entityStatusInitialState: IEntityStatusState = {
    completedActions: [],
    inProgressActions: [],
    failedActions: []
};

