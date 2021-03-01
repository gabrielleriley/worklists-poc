import { IActionWorkflowSchema, ApiResponseType, ApiProperties } from "../interfaces";
import { isPaged } from "./schema-helpers";
import * as Helpers from '../../functions';

function getResponseType(options: IActionWorkflowSchema) {
    switch (options.apiResponse) {
        case ApiResponseType.EntityList:
            if (isPaged(options)) {
                return `Observable<EntityPage.IPagedEntityPayload<${Helpers.getEntityInterfaceName(options.name)}[]>>`;
            } else {
                return `Observable<EntityStatus.IEntityPayload<${Helpers.getEntityInterfaceName(options.name)}[]>>`;
            }
        case ApiResponseType.Nothing:
            return `Observable<void>`;
        case ApiResponseType.Other:
            return `Observable<EntityStatus.IEntityPayload<any>>`;
    }
}

function getArguments(options: IActionWorkflowSchema) {
    switch (options.apiProperties) {
        case ApiProperties.Criteria:
            return `criteria: ${Helpers.getEntityCriteriaInterfaceName(options.name)}`;
        case ApiProperties.Paged:
            return `pageInfo: EntityPage.IEntityPageInfo`;
        case ApiProperties.PagedAndCriteria:
            return `pageInfo: EntityPage.IEntityPageInfo, criteria: ${Helpers.getEntityCriteriaInterfaceName(options.name)}`;
        case ApiProperties.SingleEntity:
            return `entity: ${Helpers.getEntityInterfaceName(options.name)}`;
        case ApiProperties.Id:
            return `id: string | number`;
        case ApiProperties.None:
            return '';
        case ApiProperties.Other:
        default:
            return `/*TODO: Specify the arguments type*/arguments: any`;
    }
}
export function configureEntityServiceAddition(options: IActionWorkflowSchema) {
    const lines = [
        Helpers.line(`public ${options.apiMethodName}(${getArguments(options)}): ${getResponseType(options)} {`),
        Helpers.line(`throw new Error('Not yet implemented');`, 2),
        Helpers.line(`}`)
    ];
    return Helpers.convertLines(lines);
}