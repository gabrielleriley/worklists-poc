import { createTemplateEntityServiceMethod, getEntityServiceImports } from "../functions/create-template-service-method";
import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule, chain } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { fileContainsMethodDeclaration, appendToClassEnd } from "../../../shared/ast-helpers";
import { appendNamedImportsRule, appendNamespaceImportsRule } from '../../../shared/rules';

export function appendToEntityServiceRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const rule = (_tree: Tree) => {
            if (fileContainsMethodDeclaration(filePath, tree, config.apiMethodName)) {
                return tree;
            }
            let change = appendToClassEnd(filePath, tree);
            let contents = createTemplateEntityServiceMethod(config);
    
            const declarationRecorder = tree.beginUpdate(filePath);
            if (change) {
                declarationRecorder.insertLeft(change.position, `\n${contents}\n`);
            }
            tree.commitUpdate(declarationRecorder);
    
            return tree;
        }

        const imports = getEntityServiceImports(config);

        return chain([
            appendNamedImportsRule(filePath, imports.namedImports ?? []),
            appendNamespaceImportsRule(filePath, imports.namespaceImports ?? []),
            rule,
        ]);
    };
}