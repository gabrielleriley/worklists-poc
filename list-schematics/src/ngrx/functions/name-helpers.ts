import { strings } from "@angular-devkit/core";

// Entity
export function getEntityInterfaceName(name: string) {
    return `I${strings.classify(name)}Entity`;
}

export function getEntityCriteriaInterfaceName(name: string) {
    return `I${strings.classify(name)}EntityQueryCriteria`;
}

// State
export function getStateNameVariable(name: string) {
    return `${strings.camelize(name)}StateName`
}

export function getStateName(name: string) {
    return `${strings.classify(name)}EntityState`;
}

// Reducer
export function getReducerName(name: string) {
    return `${strings.camelize(name)}Reducer`;
}

// Entity Service
export function getEntityServiceName(name: string) {
    return `${strings.classify(name)}EntityService`;
}

// Effects
export function getEntityEffectsName(name: string) {
    return `${strings.classify(name)}EntityEffects`;
}

// Module
export function getEntityModuleName(name: string) {
    return `${strings.classify(name)}EntityStateModule`;
}
