import { Rule, Tree } from "@angular-devkit/schematics";
import { IActionWorkflowSchema } from "../interfaces";
import { configureActionAdditions } from "../functions/configure-action-addition";
import { appendToFileEnd } from "../functions/append-to-file-end";

export function appendToActionsRule(filePath: string, config: IActionWorkflowSchema): Rule {
    return (tree: Tree) => {
        const newContents = configureActionAdditions(config);
        let change = appendToFileEnd(filePath, tree);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, `${newContents}\n`);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}