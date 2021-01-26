import { ActionTypes, ActionState } from '../constants';
import { strings } from '@angular-devkit/core';

export function getActionNamespace(name: string) {
    return `${strings.classify(name)}Action`;
}

export function getActionName(type: ActionTypes, state: ActionState = ActionState.Trigger) {
    if (type === ActionTypes.Refetch) {
        return ActionTypes.Refetch;
    } else {
        return `${type}${state}`;
    }
}

export function getActionNameWithNamespace(entityName: string, type: ActionTypes, state: ActionState = ActionState.Trigger) {
    return `${getActionNamespace(entityName)}.${getActionName(type, state)}`;
}

