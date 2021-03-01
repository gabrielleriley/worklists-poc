import * as Helpers from '../../functions';
import { IActionWorkflowSchema } from '../interfaces';
import { strings } from '@angular-devkit/core';
import { isOther, needsCriteria, isRead, needsPageInfo } from './schema-helpers';

function getActionsImportName(name: string) {
    return `${strings.classify(name)}Actions`;
}

function getResourceMethodType(config: IActionWorkflowSchema) {
    return `EntityStatus.EntityResourceMethod.${isOther(config) ? 'Action' : config.method}`;
}

function createTriggerReducer(config: IActionWorkflowSchema) {
    const actionName = `${config.actionPrefix}Trigger`;
    const updateCriteriaState = [
        Helpers.line(`let newState: ${Helpers.getStateName(config.name)} = {`, 2),
        Helpers.line(`...state,`, 3),
        Helpers.line(`criteria: { ...state.criteria, ..._action.criteria }`, 3),
        Helpers.line(`};`, 2)
    ];
    const noCriteriaUpdate = [
        Helpers.line(`let newState: ${Helpers.getStateName(config.name)} = { ...state };`, 2)
    ];
    const entityStatusMethod = `EntityStatus.${isRead(config) ? 'updateStatusStateOnCancelableTrigger' : 'updateStatusStateOnTrigger'}`
    const updateStatus = [
        Helpers.line(`newState = ${entityStatusMethod}({`, 2),
        Helpers.line(`resourceMethodType: ${getResourceMethodType(config)}`, 3),
        Helpers.line(`}, newState);`, 2)
    ];
    const updatePageInfoStatus = needsPageInfo(config)
        ? [Helpers.line(`newState = EntityPage.updatePageInfoState(_action.pageInfo, newState);`, 2)]
        : [];
    let reducerLines = [
        Helpers.line(`on(${getActionsImportName(config.name)}.${actionName}, (state, _action) => {`),
        ...(needsCriteria(config) ? updateCriteriaState : noCriteriaUpdate),
        ...updateStatus,
        ...updatePageInfoStatus,
        Helpers.line(`return newState;`, 2),
        Helpers.line(`})`)
    ];
    return Helpers.convertLines(reducerLines);
}

export function createSuccessReducer(config: IActionWorkflowSchema) {
    const actionName = `${config.actionPrefix}Success`;
    const lines = [
        Helpers.line(`on(${getActionsImportName(config.name)}.${actionName}, (state, action) => {`),
        // TODO: Support non-collection reads with upsert
        Helpers.line(isRead(config) ? `let newState = adapter.setAll(action.entities, state);` : `let newState = { ...state };`, 2),
        ...(needsPageInfo(config)
            ? [Helpers.line('EntityPage.updateTotalCount(action.totalCount, newState);', 2)]
            : []),
        Helpers.line(`newState = EntityStatus.updateStatusStateOnSuccess({`, 2),
        Helpers.line(`resourceMethodType: ${getResourceMethodType(config)}`, 3),
        Helpers.line(`}, newState);`, 2),
        Helpers.line(`return newState;`, 2),
        Helpers.line(`})`)
    ];
    return Helpers.convertLines(lines);
}

export function createFailureReducer(config: IActionWorkflowSchema) {
    const actionName = `${config.actionPrefix}Failure`;
    const lines = [
        Helpers.line(`on(${getActionsImportName(config.name)}.${actionName}, (state) => {`),
        Helpers.line(`let newState = EntityStatus.updateStatusStateOnFailure({`, 2),
        Helpers.line(`resourceMethodType: ${getResourceMethodType(config)}`, 3),
        Helpers.line(`}, state);`, 2),
        Helpers.line(`return newState;`, 2),
        Helpers.line(`})`)
    ];
    return Helpers.convertLines(lines);
}

export function configureReducerChange(config: IActionWorkflowSchema) {
    return `,\n${[createTriggerReducer(config), createSuccessReducer(config), createFailureReducer(config)].join(',\n')}`
}