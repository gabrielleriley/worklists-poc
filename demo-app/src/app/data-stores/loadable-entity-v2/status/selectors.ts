import { IEntityStatusState, ResourceMethod } from './entity-action-timestamp.interface';

const completedActions = (state: IEntityStatusState) => state.completedActions;
const failedActions = (state: IEntityStatusState) => state.failedActions;
const inProgressActions = (state: IEntityStatusState) => state.inProgressActions;

// In Progress
const inProgressActionsByActionType = (state: IEntityStatusState, resourceMethodType: ResourceMethod) =>
    inProgressActions(state).filter(ipa => ipa.resourceMethodType === resourceMethodType);
const inProgressActionsByActionName = (state: IEntityStatusState, workflowName: string) =>
    inProgressActions(state).filter(ipa => ipa.workflowName === workflowName);
const isResourceMethodTypeInProgress = (state: IEntityStatusState, resourceMethodType: ResourceMethod) =>
    inProgressActionsByActionType(state, resourceMethodType).length > 0;

export const isLoading = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, ResourceMethod.Read);
export const isCreating = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, ResourceMethod.Create);
export const isUpdating = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, ResourceMethod.Update);
export const isPatching = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, ResourceMethod.Patch);
export const isDeleting = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, ResourceMethod.Delete);
export const isActionWorkflowInProgress = (state: IEntityStatusState, workflowName: string) =>
    inProgressActionsByActionName(state, workflowName).length > 0;

// Completed
const completedActionsByActionType = (state: IEntityStatusState, resourceMethodType: ResourceMethod) =>
    completedActions(state).filter(ipa => ipa.resourceMethodType === resourceMethodType);
const completedActionsByActionName = (state: IEntityStatusState, workflowName: string) =>
    completedActions(state).filter(ipa => ipa.workflowName === workflowName);
const isActionTypeCompleted = (state: IEntityStatusState, resourceMethodType: ResourceMethod) =>
    completedActionsByActionType(state, resourceMethodType).length > 0;

export const hasLoadCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, ResourceMethod.Read);
export const hasCreationCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, ResourceMethod.Create);
export const hasUpdateCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, ResourceMethod.Update);
export const hasPatchCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, ResourceMethod.Patch);
export const hasDeleteCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, ResourceMethod.Delete);
export const hasActionWorkflowCompleted = (state: IEntityStatusState, workflowName: string) =>
    completedActionsByActionName(state, workflowName).length > 0;

// Failed
const failedActionsByActionType = (state: IEntityStatusState, resourceMethodType: ResourceMethod) =>
    failedActions(state).filter(ipa => ipa.resourceMethodType === resourceMethodType);
const failedActionsByActionName = (state: IEntityStatusState, workflowName: string) =>
    failedActions(state).filter(ipa => ipa.workflowName === workflowName);
const hasResourceMethodTypeFailed = (state: IEntityStatusState, resourceMethodType: ResourceMethod) =>
    failedActionsByActionType(state, resourceMethodType).length > 0;

export const hasLoadFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, ResourceMethod.Read);
export const hasCreationFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, ResourceMethod.Create);
export const hasUpdateFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, ResourceMethod.Update);
export const hasPatchFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, ResourceMethod.Patch);
export const hasDeleteFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, ResourceMethod.Delete);
export const hasActionWorkflowFailed = (state: IEntityStatusState, workflowName: string) =>
    failedActionsByActionName(state, workflowName).length > 0;
