import * as Helpers from '../../functions';
import { strings } from '@angular-devkit/core';

export function createClearAction(name: string) {
    return `export const ${Helpers.createActionName(name, 'clear', 'Store')} = createAction('[${strings.capitalize(name)} Store] Clear Store');`;
}