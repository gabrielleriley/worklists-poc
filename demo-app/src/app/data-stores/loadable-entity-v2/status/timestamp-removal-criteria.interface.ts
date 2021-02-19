import { EntityActionType } from './entity-action-timestamp.interface';

export interface IEntityTimestampRemoval {
    actionName: string;
    actionType: EntityActionType;
    entityId?: number | string;
}

export interface IEntityTimestampRemovalCriteria {
    actionNames: string[];
    actionTypes: EntityActionType[];
    entityIds: (string | number)[];
}
