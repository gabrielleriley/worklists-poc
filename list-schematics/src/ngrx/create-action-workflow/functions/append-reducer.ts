import { SchematicsException, Tree } from "@angular-devkit/schematics";
import * as ts from 'typescript';
import * as Helpers from '../../functions';
import { InsertChange } from "../interfaces";

export function appendReducer(filePath: string, tree: Tree): InsertChange {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('Reducer file not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = Helpers.getSourceNodes(sourceFile);
    let reducerNode = nodes.reverse().find(n => n.kind === ts.SyntaxKind.Identifier && n.getText() === 'createReducer');
    if (!reducerNode) {
        throw new SchematicsException('No reducer found in reducer file: ' + filePath);
    }
    const relevantSiblings = reducerNode.parent.getChildren().filter(c => c.kind === ts.SyntaxKind.SyntaxList);
    let lastSibling = relevantSiblings[relevantSiblings.length - 1];
    return { filePath, position: lastSibling?.getEnd() ?? 0 };
}