import { TemplateType } from "../schema.interface";
import { ActionProperty } from "../../../shared/ngrx-helpers";

export function getTriggerProperties(templateType: TemplateType, hasCriteria: boolean) {
    switch (templateType) {
        case TemplateType.Reload:
        case TemplateType.Other:
            return [];
        case TemplateType.ReadMultiple:
            return hasCriteria ? [ActionProperty.EntityCriteria] : [];
        case TemplateType.ReadPage:
            return [
                ActionProperty.PageInfo,
                ...(hasCriteria ? [ActionProperty.EntityCriteria] : []),
            ];
        case TemplateType.Create:
        case TemplateType.Update:
            return [ActionProperty.SingleEntity];
        case TemplateType.Patch:
            return [ActionProperty.SinglePartialEntity];
        case TemplateType.DeleteById:
        case TemplateType.OtherById:
            return [ActionProperty.SingleEntityId];
        default:
            return [];
    }
}

export function getEffectsTriggerProperties(templateType: TemplateType, hasCriteria: boolean, isPaginated: boolean) {
    switch (templateType) {
        case TemplateType.Reload:
            return [
                ...(isPaginated ? [ActionProperty.PageInfo] : []),
                ...(hasCriteria ? [ActionProperty.EntityCriteria] : []),
            ];
        default:
            return getTriggerProperties(templateType, hasCriteria);
    }
}

export function getSuccessProperties(templateType: TemplateType) {
    switch (templateType) {
        case TemplateType.Reload:
        case TemplateType.ReadMultiple:
            return [ActionProperty.EntityList];
        case TemplateType.ReadPage:
            return [ActionProperty.EntityList, ActionProperty.TotalCount];
        default:
            return [];
    }
}
