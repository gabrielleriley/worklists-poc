import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';
import { strings } from "@angular-devkit/core";

export function createSelectorsImports(options: ICreateEntityStoreSchema) {
    let imports = [
        `import { createFeatureSelector, createSelector } from '@ngrx/store';`,
        `import * as EntityStatus from '${options.statusLibraryPath}';`,
        `import { ${Helpers.getStateNameVariable(options.name)}, ${Helpers.getStateName(options.name)} } from '${Helpers.getFilePath(options.name, 'state')}'`,
        `import { selectAll${strings.classify(options.name)} } from '${Helpers.getFilePath(options.name, 'reducer')}';`,
    ];
    if (options.paginated) {
        imports = [...imports, `import * as EntityPage from '${options.pagedLibraryPath}';`];
    }
    return imports.join('\n');
}

function getStateSelectorName(name: string) {
    return `select${strings.classify(name)}State`;
}

export function createStateSelector(name: string) {
    return `export const ${getStateSelectorName(name)} = createFeatureSelector<${ Helpers.getStateName(name)}>(${ Helpers.getStateNameVariable(name) });`;
}

function createStatusSelector(name: string, verb: string, statusSelectorName: string) {
    return `
export const is${strings.capitalize(name)}${strings.capitalize(verb)}Selector = createSelector(
    ${getStateSelectorName(name)},
    EntityStatus.${statusSelectorName}
);`
}

function createPageSelector(name: string, suffix: string, pageSelectorName: string) {
    return `
export const ${strings.camelize(name)}${strings.capitalize(suffix)}Selector = createSelector(
    ${getStateSelectorName(name)},
    EntityPage.${pageSelectorName}
);`
}

export function createEntitySelector(name: string) {
    return `
export const ${strings.camelize(name)}EntitiesSelector = createSelector(
    ${getStateSelectorName(name)},
    selectAll${strings.classify(name)}
);`
}

export function createStatusSelectors(name: string) {
    const statusSelectors = [
        createStatusSelector(name, 'Loading', 'isReading'),
        createStatusSelector(name, 'Loaded', 'hasReadCompleted'),
        createStatusSelector(name, 'Failed', 'hasReadFailed')
    ];
    return statusSelectors.join('\n');
}

function createDateTimeSelector(name: string, suffix: string, statusSelectorName: string) {
    return `
export const latest${strings.capitalize(name)}${strings.capitalize(suffix)}TimeSelector = createSelector(
    ${getStateSelectorName(name)},
    EntityStatus.${statusSelectorName}
);`
}

export function createDateTimeSelectors(name: string) {
    [
        createDateTimeSelector(name, 'ReadFailure', 'failureTimeByMethodType(EntityStatus.EntityResourceMethod.Read)')
    ].join('\n');
}

export function createCriteriaSelector(name: string) {
    return `
export const ${Helpers.getCriteriaSelectorName(name)} = createSelector(
    ${getStateSelectorName(name)},
    (state) => state.criteria
);`
}

export function createPageSelectors(name: string) {
    const selectors = [
        createPageSelector(name, 'PageIndex', 'currentPageIndex'),
        createPageSelector(name, 'PageSize', 'currentPageSize'),
        createPageSelector(name, 'TotalCount', 'totalCount'),
        createPageSelector(name, 'PageInfo', 'currentPageInfo')      
    ];
    return selectors.join('\n');
}