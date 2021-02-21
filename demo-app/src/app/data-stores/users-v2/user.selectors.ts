import { createFeatureSelector, select, createSelector } from '@ngrx/store';
import { userStateName, IUserEntityState } from './user.state';
import * as EntityStatus from '@app/data-stores/loadable-entity-v2/status';
import * as EntityPage from '@app/data-stores/loadable-entity-v2/paged';
import { selectUsers } from './user.reducer';

export const selectUsersState = createFeatureSelector<IUserEntityState>(userStateName);
export const isWorkflowInProgress = (actionName: string) => createSelector(
    selectUsersState,
    (state) => EntityStatus.isActionWorkflowInProgress(state, actionName)
);

export const isWorkflowCompleted = (actionName: string) => createSelector(
    selectUsersState,
    (state) => EntityStatus.hasActionWorkflowCompleted(state, actionName)
);

export const isWorkflowFailed = (actionName: string) => createSelector(
    selectUsersState,
    (state) => EntityStatus.hasActionWorkflowFailed(state, actionName)
);

export const isWorkflowPreloading = (actionName: string) => createSelector(
    isWorkflowCompleted(actionName),
    isWorkflowFailed(actionName),
    (isCompleted, isFailed) => !isCompleted && !isFailed
);

export const isEmpty = createSelector(
    selectUsersState,
    (state) => state.totalCount === 0
);

export const usersSelector = createSelector(
    selectUsersState,
    selectUsers
);

export const usersPageIndex = createSelector(
    selectUsersState,
    EntityPage.currentPageIndex
);

export const usersPageSize = createSelector(
    selectUsersState,
    EntityPage.currentPageSize
);

export const totalUsersCount = createSelector(
    selectUsersState,
    EntityPage.totalCount
);

export const usersCriteria = createSelector(
    selectUsersState,
    (state) => state.criteria
);

export const usersPageInfo = createSelector(
    selectUsersState,
    (state) => state.pageInfo
)
