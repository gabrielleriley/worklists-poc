import { IActionWorkflowSchema, ActionMethod, ApiProperties } from "../interfaces";

export function isRead(config: IActionWorkflowSchema) {
    return config.method === ActionMethod.Read;
}
export function isOther(config: IActionWorkflowSchema) {
    return config.method === ActionMethod.Other;
}
export function isPaged(config: IActionWorkflowSchema) {
    return config.apiProperties === ApiProperties.Paged
        || config.apiProperties === ApiProperties.PagedAndCriteria
}
export function hasCriteria(config: IActionWorkflowSchema) {
    return config.apiProperties === ApiProperties.Criteria
        || config.apiProperties === ApiProperties.PagedAndCriteria;
}
export function needsCriteria(config: IActionWorkflowSchema) {
    return isRead(config) && hasCriteria(config);
}
export function needsPageInfo(config: IActionWorkflowSchema) {
    return isRead(config) && isPaged(config);
}
