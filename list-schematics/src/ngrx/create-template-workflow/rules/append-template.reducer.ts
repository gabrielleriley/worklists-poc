import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule, Tree } from "@angular-devkit/schematics";
import { createTemplateReducerWorkflow } from "../functions/create-template-reducer-workflow";
import { appendFunctionArgument } from "../../../shared/ast-helpers";

export function appendTemplateReducerRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const newContents = createTemplateReducerWorkflow(config)
        let change = appendFunctionArgument(filePath, 'createReducer', tree);

        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.position, newContents);
        }
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}