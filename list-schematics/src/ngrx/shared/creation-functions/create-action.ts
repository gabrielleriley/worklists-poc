import { line, convertLines } from "../../../shared/formatters";
import { ActionProperty, getActionProps, ActionSuffix, createActionTypeString, getActionName } from "../../../shared/ngrx-helpers";

function createPropsDefinition(entityName: string, properties: ActionProperty[]) {
    const propsBaseIndent = 1;
    const interfaceProperties = getActionProps(entityName, properties)
        .map(p => line(p, propsBaseIndent + 1));
    const lines = [
        line(`props<{`, propsBaseIndent),
        ...interfaceProperties,
        line(`}>()`, propsBaseIndent),
    ];
    return interfaceProperties.length > 0 ? lines : [];
}

interface IActionDefinition {
    entityName: string;
    featureName: string;
    description: string;
    prefix: string;
}

function createAction(suffix: ActionSuffix, definition: IActionDefinition, properties: ActionProperty[]): string {
    const lines = [
        line(`export const ${getActionName(definition.prefix, suffix)} = createAction(`, 0),
        line(`${createActionTypeString(definition.entityName, definition.featureName, definition.description)},`, 1),
        ...createPropsDefinition(definition.entityName, properties),
        line(`);`, 0)
    ];
    return convertLines(lines);
}

export function createTriggerAction(definition: IActionDefinition, properties: ActionProperty[]): string {
    definition.description = `${definition.description} - Trigger`;
    return createAction(ActionSuffix.Trigger, definition, properties);
}

export function createSuccessAction(definition: IActionDefinition, properties: ActionProperty[]) {
    definition.description = `${definition.description} - Success`;
    return createAction(ActionSuffix.Success, definition, properties);
}

export function createFailureAction(definition: IActionDefinition, properties: ActionProperty[]) {
    definition.description = `${definition.description} - Failure`;
    return createAction(ActionSuffix.Failure, definition, properties);
}

