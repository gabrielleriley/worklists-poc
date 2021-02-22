import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as EntityStatus from '../loadable-entity-v2/status';
import * as EntityPage from '../loadable-entity-v2/paged';
import { IUserEntity } from './user.entity';
import * as UsersActions from './user.actions';
import { IUserEntityState } from './user.state';

const adapter = createEntityAdapter<IUserEntity>();
const initialState: IUserEntityState = adapter.getInitialState({
    completedActions: [],
    inProgressActions: [],
    failedActions: [],
    totalCount: 0,
    pageInfo: { pageIndex: 0, pageSize: 12 },
    criteria: undefined
});

export const userReducer = createReducer(
    initialState,
    on(UsersActions.getUsersTriggerFromLeft, (state, action) => {
        const updatedCriteriaState: IUserEntityState = {
            ...state,
            criteria: { ...state.criteria, ...action.criteria }
        };
        const statusState = EntityStatus.updateStatusesOnActionTrigger(
            {
                resourceMethodType: EntityStatus.EntityResourceMethod.Read,
                workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
            }, updatedCriteriaState);
        const pagedState = EntityPage.updatePaginationState(statusState, action.pageInfo, state.totalCount);
        return pagedState;
    }),
    on(UsersActions.getUsersTriggerFromRight, (state, action) => {
        const updatedCriteriaState: IUserEntityState = {
            ...state,
            criteria: { ...state.criteria, ...action.criteria }
        };
        const statusState = EntityStatus.updateStatusesOnActionTrigger({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        }, updatedCriteriaState);
        const pagedState = EntityPage.updatePaginationState(statusState, action.pageInfo, state.totalCount);
        return pagedState;
    }),
    on(UsersActions.getUsersSuccessFromLeft, (state, action) => {
        let newState = adapter.setAll(action.entities, state);
        newState = EntityPage.updatePaginationState(newState, newState.pageInfo, action.totalCount);
        newState = EntityStatus.updateStatusesOnActionSuccess({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        }, newState);
        return newState;
    }),
    on(UsersActions.getUsersSuccessFromRight, (state, action) => {
        let newState = adapter.setAll(action.entities, state);
        newState = EntityPage.updatePaginationState(newState, newState.pageInfo, action.totalCount);
        newState = EntityStatus.updateStatusesOnActionSuccess({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        }, newState);
        return newState;
    }),
    on(UsersActions.getUsersFailureFromLeft, (state) => {
        return EntityStatus.updateStatusOnActionFailure({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        }, state);
    }),
    on(UsersActions.getUsersFailureFromRight, (state) => {
        return EntityStatus.updateStatusOnActionFailure({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        }, state);
    }),
);

export const {
    selectAll: selectUsers
} = adapter.getSelectors();
