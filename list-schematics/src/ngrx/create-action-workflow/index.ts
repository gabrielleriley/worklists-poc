import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { IActionWorkflowSchema } from './interfaces/schema.interface';
import { appendToReducerRule, appendToActionsRule, appendToEffectsRule } from './rules';
import * as Helpers from '../functions';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function createActionWorkflow(_options: IActionWorkflowSchema): Rule {
    _options.pagedLibraryPath = "@app/data-stores/loadable-entity-v2/paged";
    _options.statusLibraryPath = "@app/data-stores/loadable-entity-v2/status";
  return (_tree: Tree, _context: SchematicContext) => {
    const rule = chain([
      appendToActionsRule(`src/${_options.directory}/${Helpers.getFileName(_options.name, 'actions')}.ts`, _options),
      appendToReducerRule(`src/${_options.directory}/${Helpers.getFileName(_options.name, 'reducer')}.ts`, _options),
      appendToEffectsRule(`src/${_options.directory}/${Helpers.getFileName(_options.name, 'effects')}.ts`, _options)
    ]);
    return rule(_tree, _context);
  };
}
