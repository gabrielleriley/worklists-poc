import { InsertChange } from "../interfaces";
import { getSourceNodes } from "./ast-helpers";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { SchematicsException } from "@angular-devkit/schematics";
import ts = require("typescript");

export function appendEnum(filePath: string, tree: Tree, identifierName: string): InsertChange {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    let identifierNode = nodes.reverse().find(n => n.kind === ts.SyntaxKind.Identifier && n.getText() === identifierName);
    if (!identifierNode) {
        throw new SchematicsException(`${identifierName} enum not found in ${filePath}`);
    }
    const relevantSiblings = identifierNode.parent.getChildren().filter(c => c.kind === ts.SyntaxKind.EnumMember);
    let lastSibling = relevantSiblings[relevantSiblings.length - 1];
    return { filePath, position: lastSibling?.getEnd() ?? 0 };
}
