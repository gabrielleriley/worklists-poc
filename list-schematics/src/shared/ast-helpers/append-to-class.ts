import { getSourceNodes } from "./ast-helpers";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { SchematicsException } from "@angular-devkit/schematics";
import ts = require("typescript");
import { InsertChange } from "../interfaces";

export function appendToClassEnd(filePath: string, tree: Tree): InsertChange {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    let classNode = nodes.find(n => n.kind === ts.SyntaxKind.ClassDeclaration);
    return { filePath, position: (classNode?.getEnd() ?? 1) - 1 };
}
