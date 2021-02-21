import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';
import { strings } from "@angular-devkit/core";

export function createReducerImports(options: ICreateEntityStoreSchema) {
    let imports = `import { createEntityAdapter } from '@ngrx/entity';\n`;
    imports += `import { createReducer, on } from '@ngrx/store';\n`;
    imports += `import { ${Helpers.getEntityInterfaceName(options.name)} } from '${Helpers.getFilePath(options.name, 'entity')}';\n`;
    imports += `import { ${Helpers.getStateName(options.name)} } from '${Helpers.getFilePath(options.name, 'state')}';\n`;
    imports += `import * as EntityStatus from '${options.statusLibraryPath}';\n`;
    imports += `import * as EntityPage from '${options.pagedLibraryPath}';\n`;
    imports += `import * as ${strings.classify(options.name)}Actions from '${Helpers.getFilePath(options.name, 'actions')}';\n`;
    return imports;
}

export function initializeAdapter(options: ICreateEntityStoreSchema) {
    return `const adapter = createEntityAdapter<${Helpers.getEntityInterfaceName(options.name)}>();`
}

export function createInitialState(options: ICreateEntityStoreSchema) {
    let initialProperties = ['completedActions: []', 'inProgressActions: []', 'failedActions: []'];
    if (options.paginated) {
        initialProperties = [...initialProperties, 'totalCount: 0', 'pageInfo: { pageIndex: 0, pageSize: 12 }'];
    }
    if (options.queryParams) {
        initialProperties = [...initialProperties, 'criteria: undefined'];
    }
    const initialStateProperties = initialProperties.reduce((acc, prop) => acc + `\t${prop},\n`, '\n');
    return `const initialState: ${Helpers.getStateName(options.name)} = adapter.getInitialState({${initialStateProperties}});`;
}

export function createReducer(options: ICreateEntityStoreSchema) {
    return `export const ${Helpers.getReducerName(options.name)} = createReducer(\n\tinitialState\n);`;
}

export function createAdapterSelectors(options: ICreateEntityStoreSchema) {
    return `
export const {
    selectAll: selectAll${strings.classify(options.name)}
} = adapter.getSelectors();`
}