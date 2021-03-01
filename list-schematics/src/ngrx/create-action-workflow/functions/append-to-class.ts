import { SchematicsException, Tree } from "@angular-devkit/schematics";
import * as ts from 'typescript';
import * as Helpers from '../../functions';
import { InsertChange } from "../interfaces";

export function appendToClassEnd(filePath: string, tree: Tree): InsertChange {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('Reducer file not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = Helpers.getSourceNodes(sourceFile);
    let classNode = nodes.find(n => n.kind === ts.SyntaxKind.ClassDeclaration);
    return { filePath, position: (classNode?.getEnd() ?? 1) - 1 };
}
