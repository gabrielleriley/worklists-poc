import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';

export function createModuleFileImports(options: ICreateEntityStoreSchema) {
    const imports = [
        `import { NgModule } from '@angular/core';`,
        `import { EffectsModule } from '@ngrx/effects';`,
        `import { StoreModule } from '@ngrx/store';`,
        `import { ${Helpers.getEntityEffectsName(options.name)} } from '${Helpers.getFilePath(options.name, 'effects')}';`,
        `import { ${Helpers.getReducerName(options.name)} } from '${Helpers.getFilePath(options.name, 'reducer')}';`,
        `import { ${Helpers.getStateNameVariable(options.name)} } from '${Helpers.getFilePath(options.name, 'state')}';`,
    ];
    return imports.join('\n');
}

export function createModule(options: ICreateEntityStoreSchema) {
    const importsArray = [
        `StoreModule.forFeature(${Helpers.getStateNameVariable(options.name)}, ${Helpers.getReducerName(options.name)})`,
        `EffectsModule.forFeature([${Helpers.getEntityEffectsName(options.name)}])`
    ];
    return `
@NgModule({
${Helpers.TAB}imports: [\n${Helpers.TAB}${Helpers.TAB}${importsArray.join(`,\n${Helpers.TAB}${Helpers.TAB}`)}\n${Helpers.TAB}]
})
export class ${Helpers.getEntityModuleName(options.name)} { }
`
}

