import { Rule, Tree } from "@angular-devkit/schematics";
import { appendReducer } from "../functions/append-reducer";
import { configureReducerChange } from "../functions/configure-reducer-addition";
import { IActionWorkflowSchema } from "../interfaces";

export function appendToReducerRule(filePath: string, config: IActionWorkflowSchema): Rule {
    return (tree: Tree) => {
        const newContents = configureReducerChange(config)
        let change = appendReducer(filePath, tree);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, newContents);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}