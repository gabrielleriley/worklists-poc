import { ITemplateWorkflowSchema } from "../schema.interface";
import { getSuccessProperties, getTriggerProperties } from "./get-action-props";
import { createTriggerAction, createSuccessAction, createFailureAction } from "../../shared/creation-functions";

export function createActionsForTemplate(template: ITemplateWorkflowSchema) {
    const actionDefinition = {
        entityName: template.name,
        featureName: template.featureArea,
        description: template.template,
        prefix: template.actionPrefix
    };

    const actions = [
        createTriggerAction(actionDefinition, getTriggerProperties(template.template, template.hasCriteria)),
        createSuccessAction(actionDefinition, getSuccessProperties(template.template)),
        createFailureAction(actionDefinition, [])
    ];
    return `\n${actions.join('\n')}\n`;
}
