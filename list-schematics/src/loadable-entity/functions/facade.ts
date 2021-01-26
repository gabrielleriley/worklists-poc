import { IOptions } from "../loadable-entity.options";
import { strings } from "@angular-devkit/core";
import { getEntityInterfaceName, getSelectIdFunctionName, getEntityCriteriaInterfaceName } from "./entity";
import { FacadeNamespaceName, ActionTypes } from '../constants';
import { getActionNameWithNamespace } from "./action-name-helpers";

export function getFacadeInterfaceName(name: string) {
    return `I${strings.classify(name)}Facade`;
}

export function createFacadeInterface(options: IOptions) {
    const separator = `,
    `;
    const name = options.name;
    const criteriaGeneric = options.queryParams ? `<${getEntityCriteriaInterfaceName(name)}>` : '';
    let facadeInteface = `interface ${getFacadeInterfaceName(name)} 
    extends LoadableEntityFacade.SelectorFacade<${getEntityInterfaceName(name)}${ options.queryParams ? `, ${getEntityCriteriaInterfaceName(name)}` : ''}>`
    if (options.read && options.paginated) {
        facadeInteface += `${separator}${FacadeNamespaceName}.LoadPageFacade${criteriaGeneric}`;        
    }
    if (options.read && !options.paginated) {
        facadeInteface += `${separator}${FacadeNamespaceName}.LoadAllFacade${criteriaGeneric}`;
    }
    if (options.read) {
        facadeInteface += `${separator}${FacadeNamespaceName}.RefetchFacade`;
    }
    if (options.deleteByKey) {
        facadeInteface += `${separator}${FacadeNamespaceName}.DeleteByKeyFacade<string | number>`;
    }
    return `${facadeInteface} { }`
}

export function createBaseFacade(options: IOptions) {
    const name = options.name;
    const separator = `
    `;
    let base = `const ${strings.classify(name)}FacadeBase = new ${FacadeNamespaceName}.EntityFacadeBuilder<${getEntityInterfaceName(name)}>(${getSelectIdFunctionName(name)})${separator}`;

    if (options.read && options.paginated) {
        base += `.addLoadPageInterface(${getActionNameWithNamespace(name, ActionTypes.ReadPaged)})${separator}`;
    }
    if (options.read && !options.paginated) {
        base += `.addLoadAllInterface(${getActionNameWithNamespace(name, ActionTypes.ReadAll)})${separator}`;
    }
    if (options.read) {
        base += `.addRefetchInterface(${getActionNameWithNamespace(name, ActionTypes.Refetch)})${separator}`
    }
    if (options.deleteByKey) {
        base += `.addDeleteByKeyInterface(${getActionNameWithNamespace(name, ActionTypes.DeleteByKey)})${separator}`;
    }
    return `${base}.buildFacade<${getFacadeInterfaceName(name)}>();`;
}