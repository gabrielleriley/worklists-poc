import { createAction, props } from '@ngrx/store';
import { IUserQueryCriteria, IUserEntity } from './user.entity';
import { IEntityPageInfo } from '../loadable-entity-v2/paged';

export enum UserActionsActionWorkflowNames {
    GetFromLeft = '[Demo Left] Get Users',
    GetFromRight = '[Demo Right] Get Users'
}

export interface IUserLoadProps {
    criteria?: Partial<IUserQueryCriteria>;
    pageInfo?: Partial<IEntityPageInfo>;
}

export const getUsersTriggerFromLeft = createAction(UserActionsActionWorkflowNames.GetFromLeft, props<IUserLoadProps>());
export const getUsersTriggerFromRight = createAction(UserActionsActionWorkflowNames.GetFromRight, props<IUserLoadProps>());
export const getUsersSuccessFromLeft = createAction('[Demo Left] Get Users Success',
    props<{ totalCount: number, entities: IUserEntity[] }>());
export const getUsersSuccessFromRight = createAction('[Demo Right] Get Users Success',
    props<{ totalCount: number, entities: IUserEntity[] }>());
export const getUsersFailureFromLeft = createAction('[Demo Left] Get Users Failure');
export const getUsersFailureFromRight = createAction('[Demo Right] Get Users Failure');
