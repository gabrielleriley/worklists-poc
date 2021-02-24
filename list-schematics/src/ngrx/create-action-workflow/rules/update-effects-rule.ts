import { Rule, Tree } from "@angular-devkit/schematics";
import { appendToClassEnd } from "../functions/append-to-class";
import { IActionWorkflowSchema } from "../interfaces";
import { configureEffectAddition } from "../functions/configure-effect-addition";

export function appendToEffectsRule(filePath: string, _config: IActionWorkflowSchema): Rule {
    return (tree: Tree) => {
        let change = appendToClassEnd(filePath, tree);
        let contents = configureEffectAddition(_config);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, contents);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}