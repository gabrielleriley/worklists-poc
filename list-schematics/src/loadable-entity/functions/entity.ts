import { strings } from "@angular-devkit/core";

export function getEntityInterfaceName(name: string) {
    return `I${strings.classify(name)}Entity`
}

export function getEntityCriteriaInterfaceName(name: string) {
    return `I${strings.classify(name)}QueryCriteria`;
}

export function getSelectIdFunctionName(name: string) {
    return `select${strings.capitalize(name)}Id`;
}
