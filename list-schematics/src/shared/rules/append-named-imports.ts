import { Rule, chain, SchematicContext } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { appendNamedImports } from "../ast-helpers";
import { IVerifyNamedImport } from "../interfaces";

function appendImport(filePath: string, namedImport: IVerifyNamedImport): Rule {
    return (tree: Tree) => {
        const change = appendNamedImports(filePath, tree, namedImport);
        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            console.log(change);
            declarationRecorder.insertLeft(change.position, change.contents);
        }
        tree.commitUpdate(declarationRecorder);
        return tree;
    }
}
export function appendNamedImportsRule(filePath: string, namedImports: IVerifyNamedImport[]): Rule {
    return (tree: Tree, context: SchematicContext) => {
        const ruleChain = chain(
            namedImports.map((ni) => appendImport(filePath, ni))
        );
        return ruleChain(tree, context);
    }
}