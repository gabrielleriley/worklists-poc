import { ITemplateWorkflowSchema } from "./schema.interface";
import { chain, Rule, Tree, SchematicContext } from "@angular-devkit/schematics";
import * as TemplateRule from './rules';
import { getFileName, getEntityServiceFileName } from "../functions";

// ng g list-schematics:create-entity-store --directory test --name test --paginated false --queryParams false

// ng g list-schematics:create-template-workflow --directory test --name test --isPaginated true --hasCriteria true --featureArea sdfas

export function createTemplateActionWorkflow(_options: ITemplateWorkflowSchema): Rule {
    _options.pagedLibraryPath = "@app/data-stores/loadable-entity-v2/paged";
    _options.statusLibraryPath = "@app/data-stores/loadable-entity-v2/status";
    return (_tree: Tree, _context: SchematicContext) => {
        const rule = chain([
            TemplateRule.doThing(`src/${_options.directory}/${getFileName(_options.name, 'actions')}.ts`, _options),
            TemplateRule.appendTemplateActionsRule(`src/${_options.directory}/${getFileName(_options.name, 'actions')}.ts`, _options),
            TemplateRule.appendTemplateReducerRule(`src/${_options.directory}/${getFileName(_options.name, 'reducer')}.ts`, _options),
            TemplateRule.appendToEntityServiceRule(`src/${_options.directory}/${getEntityServiceFileName(_options.name)}.ts`, _options),
            TemplateRule.appendTemplateEffectsRule(`src/${_options.directory}/${getFileName(_options.name, 'effects')}.ts`, _options)
        ]);
        return rule(_tree, _context);
    };
}
