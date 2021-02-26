import { strings } from "@angular-devkit/core";

export const ENTITY_SELECTOR = 'Selectors';

export function getCriteriaSelectorName(name: string) {
    return `${ENTITY_SELECTOR}.${strings.camelize(name)}CriteriaSelector`;
}

export function getCurrentPageIndexSelectorName(name: string) {
    return `${ENTITY_SELECTOR}${strings.camelize(name)}${strings.capitalize('PageIndex')}Selector`;
}

export function getCurrentPageSizeSelectorName(name: string) {
    return `${ENTITY_SELECTOR}${strings.camelize(name)}${strings.capitalize('PageSize')}Selector`;
}

export function getCurrentPageInfoSelectorName(name: string) {
    return `${ENTITY_SELECTOR}${strings.camelize(name)}${strings.capitalize('PageInfo')}Selector`;
}