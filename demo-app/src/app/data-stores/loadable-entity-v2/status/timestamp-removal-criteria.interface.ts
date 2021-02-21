import { ResourceMethod } from './entity-action-timestamp.interface';

export interface IEntityTimestampRemoval {
    workflowName: string;
    resourceMethodType: ResourceMethod;
    entityId?: number | string;
}

export interface IEntityTimestampRemovalCriteria {
    workflowNames: string[];
    resourceMethodTypes: ResourceMethod[];
    entityIds: (string | number)[];
}
