import { TemplateType, ITemplateWorkflowSchema } from "../schema.interface";
import { ResourceMethodEnumEntry } from "../../../shared/ngrx-helpers";
import { ReducerAdapterAction, IReducerConfig, createReducerWorkflow } from "../../shared/creation-functions";

function getResourceMethod(templateType: TemplateType) {
    switch (templateType) {
        case TemplateType.Reload:
        case TemplateType.ReadMultiple:
        case TemplateType.ReadPage:
            return ResourceMethodEnumEntry.Read;
        case TemplateType.Create:
            return ResourceMethodEnumEntry.Create;
        case TemplateType.Update:
            return ResourceMethodEnumEntry.Update;
        case TemplateType.Patch:
            return ResourceMethodEnumEntry.Patch;
        case TemplateType.DeleteById:
            return ResourceMethodEnumEntry.Delete;
        case TemplateType.OtherById:
        case TemplateType.Other:
            return ResourceMethodEnumEntry.Action;
        default:
            return ResourceMethodEnumEntry.Action;
    }
}

function isCancelable(templateType: TemplateType) {
    return [TemplateType.ReadMultiple, TemplateType.ReadPage, TemplateType.Reload]
        .includes(templateType);
}

function updatePaging(templateType: TemplateType) {
    return templateType === TemplateType.ReadPage;
}

function updateCriteria(template: ITemplateWorkflowSchema) {
    return [
        TemplateType.ReadMultiple, TemplateType.ReadPage
    ].includes(template.template) && template.hasCriteria;
}

function getAdapterAction(templateType: TemplateType) {
    return isCancelable(templateType)
        ? ReducerAdapterAction.SetAll
        : ReducerAdapterAction.None;
}

export function createTemplateReducerWorkflow(template: ITemplateWorkflowSchema) {
    const config: IReducerConfig = {
        resourceMethodEntry: getResourceMethod(template.template),
        entityName: template.name,
        actionPrefix: template.actionPrefix,
        cancelable: isCancelable(template.template),
        updatePaging: updatePaging(template.template),
        updateCriteria: updateCriteria(template),
        adapterAction: getAdapterAction(template.template)
    };

    return `\n${createReducerWorkflow(config)}\n`;
}