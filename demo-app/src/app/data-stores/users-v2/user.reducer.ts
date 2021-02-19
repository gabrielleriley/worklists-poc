import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as EntityStatus from '../loadable-entity-v2/status';
import { IUserEntity } from './user.entity';
import * as UsersActions from './user.actions';

const adapter = createEntityAdapter<IUserEntity>();
const initialState = adapter.getInitialState({
    ...EntityStatus.entityStatusInitialState
});

export const userReducer = createReducer(
    initialState,
    on(UsersActions.getUsersTriggerFromLeft, (state) => {
        const statusState = EntityStatus.updateStatusesOnActionTrigger({
            state,
            actionType: EntityStatus.EntityActionType.Read,
            actionName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        });
        return statusState;
    }),
    on(UsersActions.getUsersTriggerFromRight, (state) => {
        const statusState = EntityStatus.updateStatusesOnActionTrigger({
            state,
            actionType: EntityStatus.EntityActionType.Read,
            actionName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        });
        return statusState;
    }),
    on(UsersActions.getUsersSuccessFromLeft, (state, action) => {
        let newState = { ...state };
        newState = EntityStatus.updateStatusesOnActionSuccess({
            state,
            actionType: EntityStatus.EntityActionType.Read,
            actionName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        });
        return newState;
    }),
    on(UsersActions.getUsersSuccessFromRight, (state, action) => {
        let newState = { ...state };
        newState = EntityStatus.updateStatusesOnActionSuccess({
            state,
            actionType: EntityStatus.EntityActionType.Read,
            actionName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        });
        return newState;
    }),
    on(UsersActions.getUsersFailureFromLeft, (state, action) => {
        let newState = { ...state };
        newState = EntityStatus.updateStatusOnActionFailure({
            state,
            actionType: EntityStatus.EntityActionType.Read,
            actionName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        });
        return newState;
    }),
    on(UsersActions.getUsersFailureFromRight, (state, action) => {
        let newState = { ...state };
        newState = EntityStatus.updateStatusOnActionFailure({
            state,
            actionType: EntityStatus.EntityActionType.Read,
            actionName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        });
        return newState;
    }),
);
