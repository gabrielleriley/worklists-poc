import { EntityState } from '@ngrx/entity';
import { LoadableAction } from './loadable-action.enum';

export type IEntityKeySelector = (entity: any) => LoadableEntityTypeKey;

export interface ILoadableActionTimestamp<CustomActionType = {}> {
    loadableActionType: LoadableAction,
    timestamp: Date,
    identity?: string | number;
    nonCrudActionTypeName?: CustomActionType; // Intended for tracking extraneous "action" HTTP endpoints (ex: send, publish, etc)
}

export interface ILoadableActionErrorTimestamp<CustomActionType = {}> extends ILoadableActionTimestamp<CustomActionType> {
    errorMessage?: string;
}

interface ILoadableEntityProperties<Criteria = {}> {
    totalEntitiesCount: number;
    inProgressActions: ILoadableActionTimestamp[];
    completedActions: ILoadableActionTimestamp[];
    failedActions: ILoadableActionErrorTimestamp[];
    criteria: Criteria;
}

export interface ILoadableEntityState<T, Criteria = {}> extends EntityState<T>, ILoadableEntityProperties<Criteria> { }

export const loadableEntityInitialState: ILoadableEntityProperties = {
    totalEntitiesCount: 0,
    inProgressActions: [],
    completedActions: [],
    failedActions: [],
    criteria: { }
}

export interface ILoadablePageInfo {
    pageIndex: number;
    pageSize: number;
}

export interface ILoadableEntityPageProperties<Criteria = {}> extends ILoadableEntityProperties<Criteria> {
    currentPage: ILoadablePageInfo;
}

export interface ILoadablePagedEntityState<T, Criteria = { }> extends ILoadableEntityState<T, Criteria>, ILoadableEntityPageProperties<Criteria> { }


export const loadablePagedEntityInitialState: ILoadableEntityPageProperties = {
    ...loadableEntityInitialState,
    currentPage: { pageIndex: 0, pageSize: 0 }
}

export type LoadableEntityTypeKey = string | number;
