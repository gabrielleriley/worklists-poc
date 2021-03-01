import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';
import { strings } from "@angular-devkit/core";

export function createEffectsImports(options: ICreateEntityStoreSchema) {
    let imports = [
        `import { Injectable } from '@angular/core';`,
        `import { Actions } from '@ngrx/effects';`,
        `import { Store } from '@ngrx/store';`,
        `import { ${Helpers.getEntityServiceName(options.name)} } from './${strings.dasherize(options.name)}-entity.service';`
    ];
    return imports.join('\n');
}

export function createEffectsService(options: ICreateEntityStoreSchema) {
    return `@Injectable()
export class ${Helpers.getEntityEffectsName(options.name)} {
    constructor(
        private actions: Actions,
        private store: Store,
        private entityService: ${Helpers.getEntityServiceName(options.name)}
    ) { }
}\n`
}
