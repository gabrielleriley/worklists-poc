import { TemplateType } from "../schema.interface";
import { ActionProperty } from "../../../shared/ngrx-helpers";

export function getTriggerProperties(templateType: TemplateType, hasCriteria = false) {
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
        case TemplateType.Patch:
            return [ActionProperty.SingleEntity];
        case TemplateType.DeleteById:
        case TemplateType.OtherById:
            return [ActionProperty.SingleEntityId];
        default:
            return [];
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
