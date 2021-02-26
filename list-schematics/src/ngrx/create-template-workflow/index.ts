import { ITemplateWorkflowSchema } from "./schema.interface";
import { chain, Rule, Tree, SchematicContext } from "@angular-devkit/schematics";
import { getFileName, getEntityServiceFileName } from "@ngrx/functions";
import * as TemplateRule from './rules';

export function createTemplateActionWorkflow(_options: ITemplateWorkflowSchema): Rule {
    _options.pagedLibraryPath = "@app/data-stores/loadable-entity-v2/paged";
    _options.statusLibraryPath = "@app/data-stores/loadable-entity-v2/status";
    return (_tree: Tree, _context: SchematicContext) => {
        const rule = chain([
            TemplateRule.appendTemplateActionsRule(`src/${_options.directory}/${getFileName(_options.name, 'actions')}.ts`, _options),
            TemplateRule.appendTemplateReducerRule(`src/${_options.directory}/${getFileName(_options.name, 'reducer')}.ts`, _options),
            TemplateRule.appendToEntityServiceRule(`src/${_options.directory}/${getEntityServiceFileName(_options.name)}.ts`, _options),
            TemplateRule.appendTemplateEffectsRule(`src/${_options.directory}/${getFileName(_options.name, 'effects')}.ts`, _options)
        ]);
        return rule(_tree, _context);
    };
}
