import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule, Tree } from "@angular-devkit/schematics";
import { createActionsForTemplate } from "../functions/create-template-actions";
import { appendToFileEnd } from "@shared/ast-helpers";

export function appendTemplateActionsRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const newContents = createActionsForTemplate(config);
        let change = appendToFileEnd(filePath, tree);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, `${newContents}\n`);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}