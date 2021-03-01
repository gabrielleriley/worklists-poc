import { ResourceMethodEnumEntry, getStateName } from "../../../shared/ngrx-helpers";
import { line, convertLines } from "../../../shared/formatters";

function getResourceMethodType(type: ResourceMethodEnumEntry) {
    return `EntityStatus.EntityResourceMethod.${type}`;
}

export enum ReducerAdapterAction {
    None,
    SetAll,
}
export interface IReducerConfig {
    resourceMethodEntry: ResourceMethodEnumEntry;
    entityName: string;
    actionPrefix: string;
    cancelable: boolean;
    updatePaging: boolean;
    updateCriteria: boolean;
    adapterAction: ReducerAdapterAction
}

function createTriggerReducer(config: IReducerConfig) {
    const actionName = `${config.actionPrefix}Trigger`;
    const updateCriteriaState = [
        line(`let newState: ${getStateName(config.entityName)} = {`, 2),
        line(`...state,`, 3),
        line(`criteria: { ...state.criteria, ...action.criteria }`, 3),
        line(`};`, 2)
    ];
    const noCriteriaUpdate = [
        line(`let newState: ${getStateName(config.entityName)} = { ...state };`, 2)
    ];
    const entityStatusMethod = `EntityStatus.${ config.cancelable ? 'updateStatusStateOnCancelableTrigger' : 'updateStatusStateOnTrigger'}`
    const updateStatus = [
        line(`newState = ${entityStatusMethod}({`, 2),
        line(`resourceMethodType: ${getResourceMethodType(config.resourceMethodEntry)}`, 3),
        line(`}, newState);`, 2)
    ];
    const updatePageInfoStatus = config.updatePaging
        ? [line(`newState = EntityPage.updatePageInfoState(action.pageInfo, newState);`, 2)]
        : [];
    let reducerLines = [
        line(`on(EntityAction.${actionName}, (state, action) => {`),
        ...(config.updateCriteria ? updateCriteriaState : noCriteriaUpdate),
        ...updateStatus,
        ...updatePageInfoStatus,
        line(`return newState;`, 2),
        line(`}),`)
    ];
    return reducerLines;
}

export function createSuccessReducer(config: IReducerConfig) {
    const actionName = `${config.actionPrefix}Success`;
    const lines = [
        line(`on(EntityAction.${actionName}, (state, action) => {`),
        // TODO: Support non-collection reads with upsert
        line(config.adapterAction === ReducerAdapterAction.SetAll ? `let newState = adapter.setAll(action.entities, state);` : `let newState = { ...state };`, 2),
        ...(config.updatePaging
            ? [line('EntityPage.updateTotalCount(action.totalCount, newState);', 2)]
            : []),
        line(`newState = EntityStatus.updateStatusStateOnSuccess({`, 2),
        line(`resourceMethodType: ${getResourceMethodType(config.resourceMethodEntry)}`, 3),
        line(`}, newState);`, 2),
        line(`return newState;`, 2),
        line(`}),`)
    ];
    return lines;
}

export function createFailureReducer(config: IReducerConfig) {
    const actionName = `${config.actionPrefix}Failure`;
    const lines = [
        line(`on(EntityAction.${actionName}, (state) => {`),
        line(`const newState = EntityStatus.updateStatusStateOnFailure({`, 2),
        line(`resourceMethodType: ${getResourceMethodType(config.resourceMethodEntry)}`, 3),
        line(`}, state);`, 2),
        line(`return newState;`, 2),
        line(`})`)
    ];
    return lines;
}

export function createReducerWorkflow(config: IReducerConfig): string {
    const lines = [
        ...createTriggerReducer(config),
        ...createSuccessReducer(config),
        ...createFailureReducer(config)
    ];
    return convertLines(lines);
}