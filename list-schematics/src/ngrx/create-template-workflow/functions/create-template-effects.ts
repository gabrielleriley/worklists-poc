import { createDispatchEffect, createMergeEffect, createSwitchedEffect, IEffectDefinition } from "../../shared/creation-functions";
import { ActionSuffix, getActionName } from "../../../shared/ngrx-helpers";
import { ITemplateWorkflowSchema, TemplateType } from "../schema.interface";
import { getSuccessProperties, getTriggerProperties } from "./get-action-props";

function useSwitchEffect(templateType: TemplateType) {
    return [TemplateType.ReadMultiple, TemplateType.ReadPage]
        .includes(templateType);
}

export function createTemplateEffects(template: ITemplateWorkflowSchema) {
    const config: IEffectDefinition = {
        effectName: `${template.actionPrefix}Effect`,
        entityName: template.name,
        serviceCallName: template.apiMethodName,
        triggerActionName: getActionName(template.actionPrefix, ActionSuffix.Trigger),
        successActionName: getActionName(template.actionPrefix, ActionSuffix.Success),
        failureActionName: getActionName(template.actionPrefix, ActionSuffix.Failure),
        triggerProperties: getTriggerProperties(template.template),
        successProperties: getSuccessProperties(template.template),
        failureProperties: [],
    };

    if (useSwitchEffect(template.template)) {
        return createSwitchedEffect(config);
    } else if (template.template === TemplateType.Reload) {
        const dispatchEffect = createDispatchEffect(
            `${template.actionPrefix}Effect`,
            [],
            getActionName(template.actionPrefix, ActionSuffix.Trigger)
        );
        const workflowEffect = createSwitchedEffect(config);
        return [dispatchEffect, workflowEffect].join('\n\n');
    } else {
        return createMergeEffect(config);
    }
}