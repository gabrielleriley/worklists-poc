import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';
import { strings } from "@angular-devkit/core";

export function createEffectsImports(options: ICreateEntityStoreSchema) {
    let imports = [
        `import { Injectable } from '@angular/core';`,
        `import { Actions, createEffect, ofType } from '@ngrx/effects';`,
        `import { Store, select } from '@ngrx/store';`,
        `import { of } from 'rxjs';`,
        `import { withLatestFrom, switchMap, map, catchError, flatMap } from 'rxjs/operators';`,
        `import * as StateActions from '${Helpers.getFilePath(options.name, 'actions')}';`,
        `import * as Selectors from '${Helpers.getFilePath(options.name, 'selectors')}';`,
        `import * as EntityPage from '${options.pagedLibraryPath}'`,
        `import * as EntityStatus from '${options.statusLibraryPath}'`,
        `import { ${Helpers.getEntityCriteriaInterfaceName(options.name)}, ${Helpers.getEntityInterfaceName(options.name)} } from '${Helpers.getFilePath(options.name, 'entity')}';`,
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
}`
}
