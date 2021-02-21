import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { appendToReducerRule } from '../rules/update-reducer-rule';
import { IActionWorkflowSchema } from './schema.interface';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function createActionWorkflow(_options: IActionWorkflowSchema): Rule {
    _options.pagedLibraryPath = "@app/data-stores/loadable-entity-v2/paged";
    _options.statusLibraryPath = "@app/data-stores/loadable-entity-v2/status";
  return (_tree: Tree, _context: SchematicContext) => {
    const rule = chain([
      appendToReducerRule(`src/${_options.directory}/test.reducer.ts`)
    ]);
    return rule(_tree, _context);
  };
}
