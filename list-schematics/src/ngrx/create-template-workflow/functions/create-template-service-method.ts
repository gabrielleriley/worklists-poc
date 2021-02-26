import { ITemplateWorkflowSchema } from "../schema.interface";
import { IEntityServiceConfig, getEntityServiceMethod } from "@ngrx/shared/creation-functions";
import { getTriggerProperties, getSuccessProperties } from "./get-action-props";

export function createTemplateEntityServiceMethod(template: ITemplateWorkflowSchema) {
    const config: IEntityServiceConfig = {
        entityName: template.name,
        methodName: template.apiMethodName,
        triggerProperties: getTriggerProperties(template.template),
        responseProperties: getSuccessProperties(template.template)
    };
    return getEntityServiceMethod(config);
}
