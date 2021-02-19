import { createAction } from '@ngrx/store';

export enum UserActionsActionWorkflowNames {
    GetFromLeft = '[Demo Left] Get Users',
    GetFromRight = '[Demo Right] Get Users'
}

export const getUsersTriggerFromLeft = createAction(UserActionsActionWorkflowNames.GetFromLeft);
export const getUsersTriggerFromRight = createAction(UserActionsActionWorkflowNames.GetFromRight);
export const getUsersSuccessFromLeft = createAction('[Demo Left] Get Users Success');
export const getUsersSuccessFromRight = createAction('[Demo Right] Get Users Success');
export const getUsersFailureFromLeft = createAction('[Demo Left] Get Users Success');
export const getUsersFailureFromRight = createAction('[Demo Right] Get Users Success');
