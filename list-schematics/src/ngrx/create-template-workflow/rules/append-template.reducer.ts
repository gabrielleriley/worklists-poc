import { chain, Rule, Tree } from "@angular-devkit/schematics";
import { appendFunctionArgument } from "../../../shared/ast-helpers";
import { appendNamespaceImportsRule } from '../../../shared/rules';
import { createTemplateReducerWorkflow } from "../functions/create-template-reducer-workflow";
import { ITemplateWorkflowSchema } from "../schema.interface";

export function appendTemplateReducerRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const rule = (_tree: Tree) => {
            const newContents = createTemplateReducerWorkflow(config)
            let change = appendFunctionArgument(filePath, 'createReducer', tree);

            const declarationRecorder = tree.beginUpdate(filePath);
            if (change) {
                declarationRecorder.insertLeft(change.position, `,${newContents.trimEnd()}`);
            }
            tree.commitUpdate(declarationRecorder);

            return tree;
        }

        return chain([
            // TODO: change verified imports based upon template type
            appendNamespaceImportsRule(filePath, [
                {
                    namespace: 'EntityPage', moduleSpecifier: config.pagedLibraryPath
                },
                {
                    namespace: 'EntityStatus', moduleSpecifier: config.statusLibraryPath
                }
            ]),
            rule
        ]);
    };
}
