import { Rule, SchematicContext, Tree, template, move, apply, url } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function tableSchematics(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const rules: Rule[] = [
      template({
        ...strings,
        ..._options
      }),
      move(`src/${_options.directory}`)
    ];
    const source = url('./files');
    return apply(source, rules)(_context);
  };
}
