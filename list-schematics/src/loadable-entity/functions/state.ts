import { strings } from "@angular-devkit/core";

export function getStateNameVariable(name: string) {
    return `${strings.camelize(name)}StateName`
}