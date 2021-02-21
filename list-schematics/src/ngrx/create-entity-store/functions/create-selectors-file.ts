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
    return `export const ${getStateSelectorName(name)} = createFeatureSelector<${ Helpers.getStateName(name)}>(${ Helpers.getStateNameVariable(name) })`;
}

