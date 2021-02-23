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
        let newState: IUserEntityState = {
            ...state,
            criteria: { ...state.criteria, ...action.criteria }
        };
        newState = EntityStatus.updateStatusStateOnTrigger(
            {
                resourceMethodType: EntityStatus.EntityResourceMethod.Read,
                workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
            }, newState);
        return EntityPage.updatePageInfoState(action.pageInfo, newState);
    }),
    on(UsersActions.getUsersTriggerFromRight, (state, action) => {
        let newState: IUserEntityState = {
            ...state,
            criteria: { ...state.criteria, ...action.criteria }
        };
        newState = EntityStatus.updateStatusStateOnTrigger({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        }, newState);
        return EntityPage.updatePageInfoState(action.pageInfo, newState);
    }),
    on(UsersActions.getUsersSuccessFromLeft, (state, action) => {
        let newState = adapter.setAll(action.entities, state);
        newState = EntityPage.updateTotalCount(action.totalCount, newState);
        newState = EntityStatus.updateStatusStateOnSuccess({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        }, newState);
        return newState;
    }),
    on(UsersActions.getUsersSuccessFromRight, (state, action) => {
        let newState = adapter.setAll(action.entities, state);
        newState = EntityPage.updateTotalCount(action.totalCount, newState);
        newState = EntityStatus.updateStatusStateOnSuccess({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        }, newState);
        return newState;
    }),
    on(UsersActions.getUsersFailureFromLeft, (state) => {
        return EntityStatus.updateStatusStateOnFailure({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromLeft,
        }, state);
    }),
    on(UsersActions.getUsersFailureFromRight, (state) => {
        return EntityStatus.updateStatusStateOnFailure({
            resourceMethodType: EntityStatus.EntityResourceMethod.Read,
            workflowName: UsersActions.UserActionsActionWorkflowNames.GetFromRight,
        }, state);
    }),
);

export const {
    selectAll: selectUsers
} = adapter.getSelectors();
