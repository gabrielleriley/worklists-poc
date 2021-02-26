import { createFailureAction, createSuccessAction, createTriggerAction } from "@ngrx/shared/creation-functions";
import { ITemplateWorkflowSchema } from "../schema.interface";
import { getSuccessProperties, getTriggerProperties } from "./get-action-props";

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
