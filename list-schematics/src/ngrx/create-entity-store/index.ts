import { Rule, SchematicContext, Tree, template, move, apply, url } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import * as CreateStoreFunctions from './functions';
import * as Helpers from '../functions';
import { ICreateEntityStoreSchema } from './schema.interface';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function createStoreSchematics(_options: ICreateEntityStoreSchema): Rule {
    _options.pagedLibraryPath = "@app/data-stores/loadable-entity-v2/paged";
    _options.statusLibraryPath = "@app/data-stores/loadable-entity-v2/status";
  return (_tree: Tree, _context: SchematicContext) => {
    const rules: Rule[] = [
      template({
        ...strings,
        ...CreateStoreFunctions,
        ...Helpers,
        ..._options,
        schemaOptions: _options
      }),
      move(`src/${_options.directory}`)
    ];
    const source = url('./files');
    return apply(source, rules)(_context);
  };
}
