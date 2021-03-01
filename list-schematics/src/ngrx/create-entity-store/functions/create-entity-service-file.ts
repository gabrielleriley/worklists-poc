import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from '../../functions';

export function createEntityServiceImports() {
    let imports = [
        `import { Injectable } from '@angular/core';`,
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
