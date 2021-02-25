import { strings } from "@angular-devkit/core";
import * as Helpers from '../../functions';
import { ApiResponseType, IActionWorkflowSchema, ApiProperties } from "../interfaces";
import { needsCriteria, needsPageInfo } from "./schema-helpers";

function createActionType(options: IActionWorkflowSchema, suffix: string) {
    return `'[${strings.capitalize(options.name)} | ${strings.capitalize(options.featureArea)}] ${options.method} ${suffix}'`;
}
function getTriggerProps(options: IActionWorkflowSchema) {
    switch(options.apiProperties) {
        case ApiProperties.Paged:
        case ApiProperties.PagedAndCriteria:
        case ApiProperties.Criteria:
            let properties: string[] = [];
            if (needsPageInfo(options)) {
                properties = [...properties, `pageInfo?: Partial<IEntityPageInfo>`];
            }
            if (needsCriteria(options)) {
                properties = [...properties, `criteria?: ${Helpers.getEntityCriteriaInterfaceName(options.name)}`];
            }
            return `, props<{ ${properties.join(', ')} }>()`;
        case ApiProperties.None:
            return '';
        case ApiProperties.Other:
            return `, props<{}>()`
    }
}

function getSuccessProps(options: IActionWorkflowSchema) {
    switch(options.apiResponse) {
        case ApiResponseType.EntityList:
            let properties = [`entities: ${Helpers.getEntityInterfaceName(options.name)}[]`];
            if (needsPageInfo(options)) {
                properties = [...properties, `totalCount: number`];
            }
            return `, props<{ ${properties.join(', ')} }>()`;
        case ApiResponseType.Nothing:
            return '';
        case ApiResponseType.Other:
            return `, props<{}>()`
    }
}

function createTriggerAction(options: IActionWorkflowSchema) {
    return `export const ${options.actionPrefix}Trigger = createAction(${createActionType(options, 'Trigger')}${getTriggerProps(options)});`;
}

function createSuccessAction(options: IActionWorkflowSchema) {
    return `export const ${options.actionPrefix}Success = createAction(${createActionType(options, 'Success')}${getSuccessProps(options)});`;
}

function createFailureAction(options: IActionWorkflowSchema) {
    return `export const ${options.actionPrefix}Failure = createAction(${createActionType(options, 'Failure')});`;
}

export function configureActionAdditions(options: IActionWorkflowSchema) {
    return [
        createTriggerAction(options),
        createSuccessAction(options),
        createFailureAction(options)
    ].join('\n');
}