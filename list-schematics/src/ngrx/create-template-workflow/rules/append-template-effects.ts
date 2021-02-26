import { ITemplateWorkflowSchema } from "../schema.interface";
import { appendToClassEnd } from "@shared/ast-helpers";
import { createTemplateEffects } from "../functions/create-template-effects";
import { Rule, Tree } from "@angular-devkit/schematics";

export function appendTemplateEffectsRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        let change = appendToClassEnd(filePath, tree);
        let contents = createTemplateEffects(config);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, contents);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}