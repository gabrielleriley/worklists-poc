import { chain, Rule, SchematicContext } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { appendNamespaceImports } from "../ast-helpers";
import { IVerifyNamespaceImport } from "../interfaces";

function appendImport(filePath: string, namedImport: IVerifyNamespaceImport): Rule {
    return (tree: Tree) => {
        const change = appendNamespaceImports(filePath, tree, [namedImport]);
        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change[0].position, change[0].contents);
        }
        tree.commitUpdate(declarationRecorder);
        return tree;
    }
}
export function appendNamespaceImportsRule(filePath: string, namespaceImports: IVerifyNamespaceImport[]): Rule {
    return (tree: Tree, context: SchematicContext) => {
        const ruleChain = chain(
            namespaceImports.map((ni) => appendImport(filePath, ni))
        );
        return ruleChain(tree, context);
    }
}