import { ITemplateWorkflowSchema } from "../schema.interface";
import { getTriggerProperties, getSuccessProperties } from "./get-action-props";
import { IEntityServiceConfig, getEntityServiceMethod } from "../../shared/creation-functions";

export function createTemplateEntityServiceMethod(template: ITemplateWorkflowSchema) {
    const config: IEntityServiceConfig = {
        entityName: template.name,
        methodName: template.apiMethodName,
        triggerProperties: getTriggerProperties(template.template),
        responseProperties: getSuccessProperties(template.template)
    };
    return getEntityServiceMethod(config);
}
