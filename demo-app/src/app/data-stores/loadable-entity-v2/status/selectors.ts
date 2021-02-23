import { IEntityStatusState, EntityResourceMethod } from './entity-action-timestamp.interface';

const completedActions = (state: IEntityStatusState) => state.completedActions;
const failedActions = (state: IEntityStatusState) => state.failedActions;
const inProgressActions = (state: IEntityStatusState) => state.inProgressActions;

// In Progress
const inProgressActionsByActionType = (state: IEntityStatusState, resourceMethodType: EntityResourceMethod) =>
    inProgressActions(state).filter(ipa => ipa.resourceMethodType === resourceMethodType);
const inProgressActionsByActionName = (state: IEntityStatusState, workflowName: string) =>
    inProgressActions(state).filter(ipa => ipa.workflowName === workflowName);
const isResourceMethodTypeInProgress = (state: IEntityStatusState, resourceMethodType: EntityResourceMethod) =>
    inProgressActionsByActionType(state, resourceMethodType).length > 0;

export const isReading = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, EntityResourceMethod.Read);
export const isCreating = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, EntityResourceMethod.Create);
export const isUpdating = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, EntityResourceMethod.Update);
export const isPatching = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, EntityResourceMethod.Patch);
export const isDeleting = (state: IEntityStatusState) => isResourceMethodTypeInProgress(state, EntityResourceMethod.Delete);
export const isActionWorkflowInProgress = (state: IEntityStatusState, workflowName: string) =>
    inProgressActionsByActionName(state, workflowName).length > 0;

// Completed
const completedActionsByActionType = (state: IEntityStatusState, resourceMethodType: EntityResourceMethod) =>
    completedActions(state).filter(ipa => ipa.resourceMethodType === resourceMethodType);
const completedActionsByActionName = (state: IEntityStatusState, workflowName: string) =>
    completedActions(state).filter(ipa => ipa.workflowName === workflowName);
const isActionTypeCompleted = (state: IEntityStatusState, resourceMethodType: EntityResourceMethod) =>
    completedActionsByActionType(state, resourceMethodType).length > 0;

export const hasReadCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityResourceMethod.Read);
export const hasCreationCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityResourceMethod.Create);
export const hasUpdateCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityResourceMethod.Update);
export const hasPatchCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityResourceMethod.Patch);
export const hasDeleteCompleted = (state: IEntityStatusState) => isActionTypeCompleted(state, EntityResourceMethod.Delete);
export const hasActionWorkflowCompleted = (state: IEntityStatusState, workflowName: string) =>
    completedActionsByActionName(state, workflowName).length > 0;

// Failed
const failedActionsByActionType = (state: IEntityStatusState, resourceMethodType: EntityResourceMethod) =>
    failedActions(state).filter(ipa => ipa.resourceMethodType === resourceMethodType);
const failedActionsByActionName = (state: IEntityStatusState, workflowName: string) =>
    failedActions(state).filter(ipa => ipa.workflowName === workflowName);
const hasResourceMethodTypeFailed = (state: IEntityStatusState, resourceMethodType: EntityResourceMethod) =>
    failedActionsByActionType(state, resourceMethodType).length > 0;

export const hasReadFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, EntityResourceMethod.Read);
export const hasCreationFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, EntityResourceMethod.Create);
export const hasUpdateFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, EntityResourceMethod.Update);
export const hasPatchFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, EntityResourceMethod.Patch);
export const hasDeleteFailed = (state: IEntityStatusState) => hasResourceMethodTypeFailed(state, EntityResourceMethod.Delete);
export const hasActionWorkflowFailed = (state: IEntityStatusState, workflowName: string) =>
    failedActionsByActionName(state, workflowName).length > 0;
