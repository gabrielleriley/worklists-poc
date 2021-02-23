import { strings } from "@angular-devkit/core";
import * as Helpers from '../../functions';
import { ApiResponseType, IActionWorkflowSchema } from "../interfaces";
import { needsCriteria, needsPageInfo } from "./schema-helpers";

function createActionType(options: IActionWorkflowSchema, suffix: string) {
    return `'[${strings.capitalize(options.name)} | ${strings.capitalize(options.featureArea)}] ${options.method} ${suffix}'`;
}
function getTriggerProps(options: IActionWorkflowSchema) {
    switch(options.apiResponse) {
        case ApiResponseType.EntityList:
            let properties = [`entities: ${Helpers.getEntityInterfaceName(options.name)}[]`];
            if (needsPageInfo(options)) {
                properties = [...properties, `pageInfo?: Partial<ILoadablePageInfo>`];
            }
            if (needsCriteria(options)) {
                properties = [...properties, `criteria?: ${Helpers.getEntityCriteriaInterfaceName(options.name)}`];
            }
            return `, props<{ ${properties.join(', ')} }>()`;
        case ApiResponseType.Nothing:
            return '';
        case ApiResponseType.Other:
            return `, props<{}>()`
    }
}

function createTriggerAction(options: IActionWorkflowSchema) {
    return `export const ${options.actionPrefix}Trigger = createAction(${createActionType(options, 'Trigger')}${getTriggerProps(options)})`;
}

export function configureActionAdditions(options: IActionWorkflowSchema) {
    return [
        createTriggerAction(options),
    ].join('\n');
}