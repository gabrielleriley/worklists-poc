import { getEntityInterfaceName, getEntityCriteriaInterfaceName } from "./entity-name-helpers";
import { getEntityPageProperty, EntityPageProperty } from "./import-helpers";
import { strings } from "@angular-devkit/core";
import { line } from "../formatters";
import { IKeyValue } from "../interfaces";

export enum ActionProperty {
    EntityList,
    SingleEntity,
    PageInfo,
    TotalCount,
    EntityCriteria,
    EntityIdList,
    SingleEntityId,
}

export enum ActionSuffix {
    Trigger = 'Trigger',
    Success = 'Success',
    Failure = 'Failure'
}

export function getActionName(actionPrefix: string, actionSuffix: ActionSuffix) {
    return `${strings.camelize(actionPrefix)}${actionSuffix}`;
}

export function createActionTypeString(entityName: string, featureArea: string, description: string) {
    return `'[${strings.capitalize(entityName)} | ${strings.capitalize(featureArea)}] ${description}'`;
}

export function getActionPropertyName(property: ActionProperty): string {
    switch (property) {
        case ActionProperty.EntityList:
            return 'entities';
        case ActionProperty.SingleEntity:
            return 'entity';
        case ActionProperty.PageInfo:
            return 'pageInfo';
        case ActionProperty.TotalCount:
            return 'totalCount';
        case ActionProperty.EntityCriteria:
            return 'criteria';
        case ActionProperty.EntityIdList:
            return 'ids';
        case ActionProperty.SingleEntityId:
            return 'id';
        default:
            return ''
    }
}

export function getActionProps(entityName: string, props: ActionProperty[]): string[] {
    const properties = {
        [ActionProperty.EntityList]: `${getActionPropertyName(ActionProperty.EntityList)}: ${getEntityInterfaceName(entityName)}[]`,
        [ActionProperty.SingleEntity]: `${getActionPropertyName(ActionProperty.SingleEntity)}: ${getEntityInterfaceName(entityName)}`,
        [ActionProperty.PageInfo]: `${getActionPropertyName(ActionProperty.PageInfo)}: Partial<${getEntityPageProperty(EntityPageProperty.PageInfoInterface)}>`,
        [ActionProperty.TotalCount]: `${getActionPropertyName(ActionProperty.TotalCount)}: number`,
        [ActionProperty.EntityCriteria]: `${getActionPropertyName(ActionProperty.EntityCriteria)}: Partial<${getEntityCriteriaInterfaceName(entityName)}>`,
        [ActionProperty.EntityIdList]: `${getActionPropertyName(ActionProperty.EntityIdList)}: (string | number)[]`,
        [ActionProperty.SingleEntityId]: `${getActionPropertyName(ActionProperty.SingleEntityId)}: string | number`,
    };
    return props.map(p => properties[p]);
}

export function getActionCallLines(
    actionName: string,
    baseIndent: number,
    includeReturn: boolean,
    props: IKeyValue<ActionProperty, string>[] = [],
) {
    if (props.length === 0) {
        return [
            line(`${includeReturn ? 'return ' : '' }${actionName}()`, baseIndent)
        ];
    } else {
        return [
            line(`${includeReturn ? 'return ' : '' }${actionName}({`, baseIndent),
            ...props.map((p) => {
                return line(`${getActionPropertyName(p.key)}: ${p.value},`)
            }),
            line(`})`, baseIndent)
        ]
    }
}