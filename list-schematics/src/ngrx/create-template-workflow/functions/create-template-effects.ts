import { IVerifyImports } from "../../../shared/interfaces";
import { ActionSuffix, getActionName } from "../../../shared/ngrx-helpers";
import { getFilePath } from '../../functions/import-helpers';
import { createDispatchEffect, createMergeEffect, createSwitchedEffect, IEffectDefinition } from "../../shared/creation-functions";
import { ITemplateWorkflowSchema, TemplateType } from "../schema.interface";
import { getEffectsTriggerProperties, getSuccessProperties } from "./get-action-props";

function useSwitchEffect(templateType: TemplateType) {
    return [TemplateType.ReadMultiple, TemplateType.ReadPage]
        .includes(templateType);
}

export function verifyEffectsImports(template: ITemplateWorkflowSchema): IVerifyImports {
    // TODO: update these based upon the template type
    return {
        namespaceImports: [
            { namespace: 'EntityActions', moduleSpecifier: getFilePath(template.name, 'actions') },
            { namespace: 'Selectors', moduleSpecifier: getFilePath(template.name, 'selectors') },
        ],
        namedImports: [
            { names: ['createEffect', 'ofType'], moduleSpecifier: '@ngrx/effects' },
            { names: ['Store', 'select'], moduleSpecifier: '@ngrx/store' },
            { names: ['withLatestFrom', 'switchMap', 'map', 'catchError', 'mergeMap', 'mapTo'], moduleSpecifier: 'rxjs/operators' },
            { names: ['of'], moduleSpecifier: 'rxjs' }
        ]
    };
}

export function createTemplateEffects(template: ITemplateWorkflowSchema) {
    const config: IEffectDefinition = {
        effectName: `${template.actionPrefix}Effect`,
        entityName: template.name,
        serviceCallName: template.apiMethodName,
        triggerActionName: getActionName(template.actionPrefix, ActionSuffix.Trigger),
        successActionName: getActionName(template.actionPrefix, ActionSuffix.Success),
        failureActionName: getActionName(template.actionPrefix, ActionSuffix.Failure),
        triggerProperties: getEffectsTriggerProperties(template.template, template.hasCriteria, template.isPaginated),
        successProperties: getSuccessProperties(template.template),
        failureProperties: [],
    };

    if (useSwitchEffect(template.template)) {
        return createSwitchedEffect(config);
    } else if (template.template === TemplateType.Reload) {
        const dispatchEffect = createDispatchEffect(
            `${template.actionPrefix}DispatchEffect`,
            [],
            getActionName(template.actionPrefix, ActionSuffix.Trigger)
        );
        const workflowEffect = createSwitchedEffect(config);
        return [dispatchEffect, workflowEffect].join('\n\n');
    } else {
        return createMergeEffect(config);
    }
}