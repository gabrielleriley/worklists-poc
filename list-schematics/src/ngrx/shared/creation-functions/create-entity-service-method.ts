import { line, convertLines } from "../../../shared/formatters";
import { getActionProps, ActionProperty, getEntityInterfaceName, getEntityPageProperty, EntityPageProperty, getEntityStatusProperty, EntityStatusProperty } from "../../../shared/ngrx-helpers";

function getResponseType(entityName: string, successProperties: ActionProperty[]) {
    const entityInterfaceName = getEntityInterfaceName(entityName);
    if (successProperties.includes(ActionProperty.TotalCount)) {
        return `Observable<${getEntityPageProperty(EntityPageProperty.PagedPayloadInterface)}<${entityInterfaceName}[]>>`;
    } else if (successProperties.includes(ActionProperty.EntityList)) {
        return `Observable<${getEntityStatusProperty(EntityStatusProperty.PayloadInterface)}<${entityInterfaceName}[]>>`;
    } else {
        return `Observable<${getEntityStatusProperty(EntityStatusProperty.PayloadInterface)}<any>>`;
    }
}

function getArguments(entityName: string, properties: ActionProperty[]) {
    return getActionProps(entityName, properties);
}

export interface IEntityServiceConfig {
    entityName: string;
    methodName: string;
    triggerProperties: ActionProperty[];
    responseProperties: ActionProperty[];
}
export function getEntityServiceMethod(config: IEntityServiceConfig) {
    const validProperties = [
        ActionProperty.SingleEntityId,
        ActionProperty.EntityIdList,
        ActionProperty.SingleEntity,
        ActionProperty.PageInfo,
        ActionProperty.EntityCriteria
    ].filter(p => config.triggerProperties.includes(p));
    const methodArgs = getArguments(config.entityName, validProperties);
    const responseType = getResponseType(config.entityName, config.responseProperties);
    const lines = [
        line(`public ${config.methodName}(${methodArgs}): ${responseType} {`),
        line(`throw new Error('Not yet implemented');`, 2),
        line(`}`)
    ];

    return convertLines(lines);
}