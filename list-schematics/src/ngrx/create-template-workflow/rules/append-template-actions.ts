import { ITemplateWorkflowSchema } from "../schema.interface";
import { Rule, Tree } from "@angular-devkit/schematics";
import { createActionsForTemplate } from "../functions/create-template-actions";
import { appendToFileEnd, appendNamedImports } from "../../../shared/ast-helpers";

export function doThing(filePath: string, _config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const change = appendNamedImports(filePath, tree, { namedImports: ['map', 'mergeMap', 'flatMap', 'concatMap'], moduleSpecifier: 'rxjs' });
        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            console.log(change);
            declarationRecorder.insertLeft(change.position, change.contents);            
        }
        tree.commitUpdate(declarationRecorder);
        return tree;
    }
}
export function appendTemplateActionsRule(filePath: string, config: ITemplateWorkflowSchema): Rule {
    return (tree: Tree) => {
        const changes = [
            // (_tree: Tree) => appendNamedImports(filePath, _tree, { namedImports: ['map', 'mergeMap', 'flatMap', 'concatMap'], moduleSpecifier: 'rxjs' }),
            // (_tree: Tree) => appendNamedImports(filePath, _tree, { namedImports: ['props', 'createAction'], moduleSpecifier: '@ngrx/store' }),
            // (_tree: Tree) => appendNamespaceImports(filePath, _tree, [
            //     { namespace: 'EntityPage', moduleSpecifier: config.pagedLibraryPath },
            //     { namespace: 'EntityStatus', moduleSpecifier: config.statusLibraryPath }
            // ]),
            (_tree: Tree) => {
                const newContents = createActionsForTemplate(config);
                let change = appendToFileEnd(filePath, tree);
                return { contents: `${newContents}\n`, position: change.position, filePath }
            }                    
        ];

        changes.forEach((fn) => {
            const declarationRecorder = tree.beginUpdate(filePath);
            const change = fn(tree);
            if (change) {
                console.log(change);
                declarationRecorder.insertLeft(change.position, change.contents);
                
            }
            tree.commitUpdate(declarationRecorder);
        });
        return tree;
    };
}