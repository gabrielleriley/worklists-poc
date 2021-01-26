import { IOptions } from "../loadable-entity.options";
import { ActionCreators, ActionTypes, ActionState } from '../constants';
import { getActionName } from './action-name-helpers';
import { getEntityInterfaceName } from "./entity";
import { getStateNameVariable } from "./state";

function createWorkflowActionDefinition(name: string, type: ActionTypes, method: string) {
    return `export const {
        triggerAction: ${getActionName(type, ActionState.Trigger)},
        successAction: ${getActionName(type, ActionState.Success)},
        errorAction: ${getActionName(type, ActionState.Error)}
    } = ${method}<${getEntityInterfaceName(name)}>(${getStateNameVariable(name)});
    
    `
}

function createByKeyWorklowActionDefinition(name: string, type: ActionTypes, method: string) {
    const warning = `// TODO: change string | number to your entity's ID type
    `;
    return `${warning}export const {
        triggerAction: ${getActionName(type, ActionState.Trigger)},
        successAction: ${getActionName(type, ActionState.Success)},
        errorAction: ${getActionName(type, ActionState.Error)}
    } = ${method}<string | number>(${getStateNameVariable(name)});
    
    `
}

function createRefetchActionDefinition(name: string, method: string) {
    return `export const refetch = ${method}(${getStateNameVariable(name)})
    
    `;
}

export function createActions(options: IOptions) {
    let actions = ``;
    const entityName = options.name;
    if (options.read && options.paginated) {
        actions += createWorkflowActionDefinition(entityName, ActionTypes.ReadPaged, ActionCreators.makePageReadActions);
        actions += createRefetchActionDefinition(entityName, ActionCreators.makeRefetchPageAction);
    }
    if (options.read && !options.paginated) {
        actions += createWorkflowActionDefinition(entityName, ActionTypes.ReadAll, ActionCreators.makeReadAllActions);
        actions += createRefetchActionDefinition(entityName, ActionCreators.makeRefetchPageAction);
    }
    if (options.deleteByKey) {
        actions += createByKeyWorklowActionDefinition(entityName, ActionTypes.DeleteByKey, ActionCreators.makeDeleteByKeyActions);
    }
    return actions.trim();
}
