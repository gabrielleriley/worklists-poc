import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule, Tree, chain } from "@angular-devkit/schematics";
import { createActionsForTemplate } from "../functions/create-template-actions";
import { appendToFileEnd } from "../../../shared/ast-helpers";
import { appendNamedImportsRule } from '../../../shared/rules/append-named-imports';

export function appendTemplateActionsRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const rule = (_tree: Tree) => {
            const newContents = createActionsForTemplate(config);
            let change = appendToFileEnd(filePath, tree);
            const declarationRecorder = tree.beginUpdate(filePath);
            declarationRecorder.insertLeft(change.position, newContents);
            tree.commitUpdate(declarationRecorder);
            return tree;
        }

        return chain([
            appendNamedImportsRule(filePath, [
                { namedImports: ['map', 'mergeMap', 'flatMap', 'concatMap'], moduleSpecifier: 'rxjs' }
            ]),
            rule
        ]);
    };
}