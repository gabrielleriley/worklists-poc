import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { SchematicsException } from "@angular-devkit/schematics";
import ts = require("typescript");
import { getSourceNodes } from "./ast-helpers";

export function fileContainsMethodDeclaration(filePath: string, tree: Tree, methodName: string): boolean {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    const methodDelcarations = nodes.filter(n => n.kind === ts.SyntaxKind.MethodDeclaration);
    const methodNode = methodDelcarations
        .map((md) => md.getChildren())
        .reduce((nodes, acc) => [...acc, ...nodes], [])
        .filter(childNode => childNode.kind === ts.SyntaxKind.Identifier)
        .find(childNode => childNode.getText() === methodName);
    return methodNode !== undefined;
}
