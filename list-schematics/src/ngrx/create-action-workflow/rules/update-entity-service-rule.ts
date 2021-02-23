import { Rule, Tree } from "@angular-devkit/schematics";
import { appendToClassEnd } from "../functions/append-to-class";
import { IActionWorkflowSchema } from "../interfaces";

export function appendToEntityServiceRule(filePath: string, _config: IActionWorkflowSchema): Rule {
    return (tree: Tree) => {
        let change = appendToClassEnd(filePath, tree);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, '\nHEYOOO\n');
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}