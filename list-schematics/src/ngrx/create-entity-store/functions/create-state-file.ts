import { ICreateEntityStoreSchema } from "../schema.interface";
import * as Helpers from "../../functions";
import { strings } from "@angular-devkit/core";

export function createStateFileImports(options: ICreateEntityStoreSchema) {
    let imports = `import { EntityState } from '@ngrx/entity';`; 
    const entityInterfaces = options.queryParams ? [
        Helpers.getEntityInterfaceName(options.name),
        Helpers.getEntityCriteriaInterfaceName(options.name)
    ] : [Helpers.getEntityInterfaceName(options.name)];
    imports += `\nimport { ${entityInterfaces.join(', ')} } from '${Helpers.getFilePath(options.name, 'entity')}'`;
    if (options.paginated) {
        imports += `\nimport { IEntityPagedState } from '${options.pagedLibraryPath}'`;
    }
    imports += `\nimport { IEntityStatusState } from '${options.statusLibraryPath}'`;
    return imports;
}

export function createStateNameConstant(options: ICreateEntityStoreSchema) {
    return `export const ${Helpers.getStateNameVariable(options.name)} = '${strings.dasherize(options.name)}-entity-state'`;
}

export function createStateInterface(options: ICreateEntityStoreSchema) {
    let interfaces = [
        `EntityState<${Helpers.getEntityInterfaceName(options.name)}>`,
        `IEntityStatusState`
    ];
    if (options.paginated) {
        interfaces = [...interfaces, `IEntityPagedState`];
    }
    return `export interface ${Helpers.getStateName(options.name)} extends ${interfaces.join(', ')} { ${options.queryParams ? `\n\tcriteria: ${Helpers.getEntityCriteriaInterfaceName(options.name)};\n` : ''}}`;
}