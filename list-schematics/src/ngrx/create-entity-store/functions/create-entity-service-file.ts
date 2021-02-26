import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';

export function createEntityServiceImports(options: ICreateEntityStoreSchema) {
    let imports = [
        `import { Injectable } from '@angular/core'`,
        `import { Observable } from 'rxjs';`,
        `import * as EntityPage from '${options.pagedLibraryPath}';`,
        `import * as EntityStatus from '${options.statusLibraryPath}'`,
        `import { ${options.queryParams ? `Helpers.getEntityCriteriaInterfaceName(options.name), ` : '' } ${Helpers.getEntityInterfaceName(options.name)} } from '${Helpers.getFilePath(options.name, 'entity')}';`,
    ];
    return imports.join('\n');
}

export function createEntityService(options: ICreateEntityStoreSchema) {
    return `// This service exists to simplify effects logic
// by calling the entity's HTTP service and mapping the DTO to the entity model
@Injectable({ providedIn: 'root' })
export class ${Helpers.getEntityServiceName(options.name)} {
    constructor() { }
}`
}
