import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule, Tree, chain } from "@angular-devkit/schematics";
import { createActionsForTemplate, verifyActionImports } from "../functions/create-template-actions";
import { appendToFileEnd } from "../../../shared/ast-helpers";
import { appendNamedImportsRule, appendNamespaceImportsRule } from '../../../shared/rules';

export function appendTemplateActionsRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const rule = (_tree: Tree) => {
            const newContents = createActionsForTemplate(config);
            let change = appendToFileEnd(filePath, tree);
            const declarationRecorder = tree.beginUpdate(filePath);
            declarationRecorder.insertLeft(change.position, `${newContents}\n`);
            tree.commitUpdate(declarationRecorder);
            return tree;
        }

        const imports = verifyActionImports(config);

        return chain([            
            appendNamedImportsRule(filePath, imports.namedImports ?? []),
            appendNamespaceImportsRule(filePath, imports.namespaceImports ?? []),
            rule
        ]);
    };
}