import { createFailureAction, createSuccessAction, createTriggerAction } from "../../shared/creation-functions";
import { ITemplateWorkflowSchema, TemplateType } from "../schema.interface";
import { getSuccessProperties, getTriggerProperties } from "./get-action-props";
import { IVerifyImports } from '../../../shared/interfaces/insert-change.interface';
import { getEntityInterfaceName, getEntityCriteriaInterfaceName } from '../../../shared/ngrx-helpers/entity-name-helpers';
import { getFilePath } from '../../functions/import-helpers';

export function verifyActionImports(template: ITemplateWorkflowSchema): IVerifyImports {
    switch (template.template) {
        case TemplateType.Create:
        case TemplateType.Patch:
        case TemplateType.Update:
        case TemplateType.ReadMultiple:
            return {
                namedImports: [
                    { names: ['createAction', 'props'], moduleSpecifier: '@ngrx/store' },
                    {
                        names: [
                            getEntityInterfaceName(template.name),
                            ...(template.hasCriteria ? [getEntityCriteriaInterfaceName(template.name)] : [])
                        ],
                        moduleSpecifier: getFilePath(template.name, 'entity')
                    }
                ]
            };
        case TemplateType.ReadPage:
            return {
                namedImports: [
                    { names: ['createAction', 'props'], moduleSpecifier: '@ngrx/store' },
                    {
                        names: [
                            getEntityInterfaceName(template.name),
                            ...(template.hasCriteria ? [getEntityCriteriaInterfaceName(template.name)] : [])
                        ],
                        moduleSpecifier: getFilePath(template.name, 'entity')
                    }
                ],
                namespaceImports: [
                    { namespace: 'EntityPage', moduleSpecifier: template.pagedLibraryPath }
                ]
            };
        case TemplateType.Reload:
            return {
                namedImports: [
                    { names: ['createAction', 'props'], moduleSpecifier: '@ngrx/store' },
                    {
                        names: [
                            getEntityInterfaceName(template.name),
                            ...(template.hasCriteria ? [getEntityCriteriaInterfaceName(template.name)] : [])
                        ],
                        moduleSpecifier: getFilePath(template.name, 'entity')
                    }
                ],
                namespaceImports: template.isPaginated ? [
                    { namespace: 'EntityPage', moduleSpecifier: template.pagedLibraryPath }
                ] : []
            };
        case TemplateType.Other:
        case TemplateType.DeleteById:
        case TemplateType.OtherById:
            return {
                namedImports: [
                    { names: ['createAction', 'props'], moduleSpecifier: '@ngrx/store' }
                ]
            };
        default:
            return {
                namedImports: [
                    { names: ['createAction'], moduleSpecifier: '@ngrx/store' }
                ]
            };
    }
}
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
    return `\n${actions.join('\n')}`;
}
