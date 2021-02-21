import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';

export function createEffectsImports(options: ICreateEntityStoreSchema) {
    let imports = [
        `import { Injectable } from '@angular/core';`,
        `import { Actions, createEffect, ofType } from '@ngrx/effects';`,
        `import { Store, select } from '@ngrx/store';`,
        `import * as StateActions from '${Helpers.getFilePath(options.name, 'actions')};'`,
        `import * as Selectors from '${Helpers.getFilePath(options.name, 'selectors')}';`,
    ];
    return imports.join('\n');
}

export function createEffectsService(options: ICreateEntityStoreSchema) {
    return `@Injectable()
export class ${Helpers.getEntityEffectsName(options.name)} {
    constructor(
        private actions: Actions,
        private store: Store,
    ) { }
}`
}
