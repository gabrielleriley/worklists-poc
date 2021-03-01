import { ITemplateWorkflowSchema, TemplateType } from "../schema.interface";
import { getTriggerProperties, getSuccessProperties } from "./get-action-props";
import { IEntityServiceConfig, getEntityServiceMethod } from "../../shared/creation-functions";
import { ActionProperty, getEntityCriteriaInterfaceName } from "../../../shared/ngrx-helpers";
import { getEntityInterfaceName } from '../../../shared/ngrx-helpers/entity-name-helpers';
import { IVerifyImports } from '../../../shared/interfaces';
import { getFilePath } from '../../functions/import-helpers';

export function getEntityServiceImports(template: ITemplateWorkflowSchema): IVerifyImports {
    const triggerProperties = getTriggerProperties(template.template, template.hasCriteria);
    const responseProperties = getSuccessProperties(template.template);
    const includeEntityInterface = responseProperties.includes(ActionProperty.EntityList)
        || triggerProperties.includes(ActionProperty.SingleEntity)
        || triggerProperties.includes(ActionProperty.SinglePartialEntity);
    const includeEntityCriteriaInterface = triggerProperties.includes(ActionProperty.EntityCriteria);
    const isPagedTemplate = template.template === TemplateType.ReadPage;
    return {
        namedImports: [
            { names: ['Observable'], moduleSpecifier: 'rxjs' },
            {
                names: [
                    ...(includeEntityInterface ? [getEntityInterfaceName(template.name)] : []),
                    ...(includeEntityCriteriaInterface ? [getEntityCriteriaInterfaceName(template.name)] : []),
                ],
                moduleSpecifier: getFilePath(template.name, 'entity'),
            }
        ],
        namespaceImports: [
            ...(isPagedTemplate ? [
                {
                    namespace: 'EntityPage',
                    moduleSpecifier: template.pagedLibraryPath
                }                
            ] : [
                {
                    namespace: 'EntityStatus',
                    moduleSpecifier: template.statusLibraryPath
                }
            ])
        ]
    }
}

export function createTemplateEntityServiceMethod(template: ITemplateWorkflowSchema) {
    const config: IEntityServiceConfig = {
        entityName: template.name,
        methodName: template.apiMethodName,
        triggerProperties: getTriggerProperties(template.template, template.hasCriteria),
        responseProperties: getSuccessProperties(template.template)
    };
    return getEntityServiceMethod(config);
}
