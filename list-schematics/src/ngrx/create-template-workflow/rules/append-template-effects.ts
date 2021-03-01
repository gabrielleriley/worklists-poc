import { ITemplateWorkflowSchema } from "../schema.interface";
import { createTemplateEffects, verifyEffectsImports } from "../functions/create-template-effects";
import { Rule, Tree, chain } from "@angular-devkit/schematics";
import { appendToClassEnd } from "../../../shared/ast-helpers";
import { appendNamedImportsRule, appendNamespaceImportsRule } from "../../../shared/rules";

export function appendTemplateEffectsRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const rule = (_tree: Tree) => {
            let change = appendToClassEnd(filePath, tree);
            let contents = createTemplateEffects(config);
    
            const declarationRecorder = tree.beginUpdate(filePath);
            if (change) {
                declarationRecorder.insertLeft(change.position, `\n${contents}\n`);
            }
            tree.commitUpdate(declarationRecorder);
    
            return tree;
        }

        const imports = verifyEffectsImports(config);

        return chain([            
            appendNamedImportsRule(filePath, imports.namedImports ?? []),
            appendNamespaceImportsRule(filePath, imports.namespaceImports ?? []),
            rule
        ]);
    };
}