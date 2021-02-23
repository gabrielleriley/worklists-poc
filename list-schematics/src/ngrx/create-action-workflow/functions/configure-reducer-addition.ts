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
    const newState = `
        let newState: ${Helpers.getStateName(config.name)} = {
            ...state, ${needsCriteria(config)
            ? `\n${Helpers.TAB}${Helpers.TAB}criteria: { ...state.criteria, ..._action.criteria }`
            : ''}
        };`;
    const updateStatus = `
        newState = EntityStatus.${isRead(config) ? 'updateStatusStateOnCancelableTrigger' : 'updateStatusStateOnTrigger'}({
            resourceMethodType: ${getResourceMethodType(config)}
        }, newState);`
    const updatePageInfoStatus = needsPageInfo(config) ? `newState = EntityPage.updatePageInfoState(action.pageInfo, newState);` : undefined;
    const returnStatement = `return newState`;
    const contents = [newState, updateStatus, updatePageInfoStatus, returnStatement]
        .filter(c => c !== undefined)
        .join(`\n${Helpers.TAB}${Helpers.TAB}`);
    return `on(${getActionsImportName(config.name)}.${actionName}, (state, _action) => {\n${contents}\n${Helpers.TAB}})`;
}

export function createSuccessReducer(config: IActionWorkflowSchema) {
    const actionName = `${config.actionPrefix}Success`;
    // TODO: Support non-collection reads
    const add = isRead(config) ? `let newState = adapter.setAll(action.entities, state);` : `let newState = { ...state };`;
    const setTotalCount = needsPageInfo(config) ? 'EntityPage.updateTotalCount(action.totalCount, newState);' : undefined;
    const updateStatus = `
        newState = EntityStatus.updateStatusStateOnSuccess({
            resourceMethodType: ${getResourceMethodType(config)}
        }, newState);`;
    const contents = [add, updateStatus, setTotalCount, 'return newState;']
        .filter(c => c !== undefined)
        .join(`${Helpers.TAB}${Helpers.TAB}\n`);
    return `on(${getActionsImportName(config.name)}.${actionName}, (state, action) => {\n${contents}\n${Helpers.TAB}})`;
}

export function createFailureReducer(config: IActionWorkflowSchema) {
    const actionName = `${config.actionPrefix}Failure`;
    const updateStatus = `
        let newState = EntityStatus.updateStatusStateOnSuccess({
            resourceMethodType: ${getResourceMethodType(config)}
        }, state);`;
    const contents = [updateStatus, 'return newState;']
        .filter(c => c !== undefined)
        .join(`${Helpers.TAB}${Helpers.TAB}\n`);
    return `on(${getActionsImportName(config.name)}.${actionName}, (state, action) => {\n${contents}\n${Helpers.TAB}})`;
}

export function configureReducerChange(config: IActionWorkflowSchema) {
    return `,\n${Helpers.TAB}${[createTriggerReducer(config), createSuccessReducer(config), createFailureReducer(config)].join(`,\n${Helpers.TAB}`)}\n`;
}