import { SchematicsException } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { IAppendPosition } from "../interfaces";
import ts = require("typescript");
import { getSourceNodes } from "./ast-helpers";

export function appendFunctionArgument(filePath: string, identifierName: string, tree: Tree): IAppendPosition {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    let reducerNode = nodes.reverse().find(n => n.kind === ts.SyntaxKind.Identifier && n.getText() === identifierName);
    if (!reducerNode) {
        throw new SchematicsException(`${identifierName} function not found in ${filePath}`);
    }
    const relevantSiblings = reducerNode.parent.getChildren().filter(c => c.kind === ts.SyntaxKind.SyntaxList);
    let lastSibling = relevantSiblings[relevantSiblings.length - 1];
    return { filePath, position: lastSibling?.getEnd() ?? 0 };
}
