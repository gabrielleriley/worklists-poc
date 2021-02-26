import { createTemplateEntityServiceMethod } from "../functions/create-template-service-method";
import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { fileContainsMethodDeclaration, appendToClassEnd } from "../../../shared/ast-helpers";

export function appendToEntityServiceRule(filePath: string, _config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        if (fileContainsMethodDeclaration(filePath, tree, _config.apiMethodName)) {
            return tree;
        }
        let change = appendToClassEnd(filePath, tree);
        let contents = createTemplateEntityServiceMethod(_config);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, `\n${contents}\n`);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}