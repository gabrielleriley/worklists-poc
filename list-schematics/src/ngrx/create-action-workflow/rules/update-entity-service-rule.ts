import { Rule, Tree } from "@angular-devkit/schematics";
import { appendToClassEnd } from "../functions/append-to-class";
import { IActionWorkflowSchema } from "../interfaces";
import { configureEntityServiceAddition } from "../functions/configure-entity-service-addition";

export function appendToEntityServiceRule(filePath: string, _config: IActionWorkflowSchema): Rule {
    return (tree: Tree) => {
        let change = appendToClassEnd(filePath, tree);
        let contents = configureEntityServiceAddition(_config);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, `${contents}\n`);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}