import { chain, Rule } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { appendTestsToSpecFile } from "../../../shared/ast-helpers";
import { appendNamespaceImportsRule } from "../../../shared/rules";
import { createTemplateReducerWorkflowSpecs } from "../functions/create-template-reducer-workflow";
import { ITemplateWorkflowSchema } from "../schema.interface";

export function appendTemplateReducerSpecRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const rule = (_tree: Tree) => {
            const newContents = createTemplateReducerWorkflowSpecs(config)
            let change = appendTestsToSpecFile(filePath, tree);

            const declarationRecorder = tree.beginUpdate(filePath);
            if (change) {
                declarationRecorder.insertLeft(change.position, `\n${newContents.trimEnd()}`);
            }
            tree.commitUpdate(declarationRecorder);

            return tree;
        }

        return chain([
            // TODO: change verified imports based upon template type
            appendNamespaceImportsRule(filePath, [
                {
                    namespace: 'EntityStatus', moduleSpecifier: config.statusLibraryPath
                }
            ]),
            rule
        ]);
    };
}
