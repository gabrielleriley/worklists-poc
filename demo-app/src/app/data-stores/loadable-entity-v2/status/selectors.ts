import { createSelector, createFeatureSelector } from "@ngrx/store";
import { IEntityStatusState, EntityActionType } from './entity-action-timestamp.interface';

const selectEntityState = createFeatureSelector<IEntityStatusState>('');

const completedActions = (state: IEntityStatusState) => state.completedActions;
const failedActions = (state: IEntityStatusState) => state.failedActions;
const inProgressActions = (state: IEntityStatusState) => state.inProgressActions;

// In Progress
const inProgressActionsByActionType = (state: IEntityStatusState, actionType: EntityActionType) =>
    inProgressActions(state).filter(ipa => ipa.actionType === actionType);
const inProgressActionsByActionName = (state: IEntityStatusState, actionName: string) =>
    inProgressActions(state).filter(ipa => ipa.actionName === actionName);
const isActionTypeInProgress = (state: IEntityStatusState, actionType: EntityActionType) =>
    inProgressActionsByActionType(state, actionType).length > 0;

export const isLoading = (state: IEntityStatusState) => isActionTypeInProgress(state, EntityActionType.Read);
export const isCreating = (state: IEntityStatusState) => isActionTypeInProgress(state, EntityActionType.Create);
export const isUpdating = (state: IEntityStatusState) => isActionTypeInProgress(state, EntityActionType.Update);
export const isPatching = (state: IEntityStatusState) => isActionTypeInProgress(state, EntityActionType.Patch);
export const isDeleting = (state: IEntityStatusState) => isActionTypeInProgress(state, EntityActionType.Delete);
export const isActionNameInProgress = (state: IEntityStatusState, actionName: string) =>
    inProgressActionsByActionName(state, actionName).length > 0;

// Completed
const completedActionsByActionType = (state: IEntityStatusState, actionType: EntityActionType) =>
    completedActions(state).filter(ipa => ipa.actionType === actionType);
const completedActionsByActionName = (state: IEntityStatusState, actionName: string) =>
    completedActions(state).filter(ipa => ipa.actionName === actionName);
const isActionTypeCompleted = (state: IEntityStatusState, actionType: EntityActionType) =>
    completedActionsByActionType(state, actionType).length > 0;

export const hasLoadCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityActionType.Read);
export const hasCreationCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityActionType.Create);
export const hasUpdateCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityActionType.Update);
export const hasPatchCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityActionType.Patch);
export const hasDeleteCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityActionType.Delete);
export const hasActionNameCompleted = (state: IEntityStatusState, actionName: string) =>
    completedActionsByActionName(state, actionName).length > 0;

// Failed
const failedActionsByActionType = (state: IEntityStatusState, actionType: EntityActionType) =>
    failedActions(state).filter(ipa => ipa.actionType === actionType);
const failedActionsByActionName = (state: IEntityStatusState, actionName: string) =>
    failedActions(state).filter(ipa => ipa.actionName === actionName);
const isActionTypeFailed = (state: IEntityStatusState, actionType: EntityActionType) =>
    failedActionsByActionType(state, actionType).length > 0;

export const hasLoadFailed = (state: IEntityStatusState) => isActionTypeFailed(state, EntityActionType.Read);
export const hasCreationFailed = (state: IEntityStatusState) => isActionTypeFailed(state, EntityActionType.Create);
export const hasUpdateFailed = (state: IEntityStatusState) => isActionTypeFailed(state, EntityActionType.Update);
export const hasPatchFailed = (state: IEntityStatusState) => isActionTypeFailed(state, EntityActionType.Patch);
export const hasDeleteFailed = (state: IEntityStatusState) => isActionTypeFailed(state, EntityActionType.Delete);
export const hasActionNameFailed = (state: IEntityStatusState, actionName: string) =>
    failedActionsByActionName(state, actionName).length > 0;
