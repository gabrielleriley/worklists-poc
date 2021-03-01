import { getSourceNodes } from "./ast-helpers";
import { IAppendPosition } from "../interfaces";
import { SchematicsException, Tree } from "@angular-devkit/schematics";
import * as ts from 'typescript';

export function appendToFileEnd(filePath: string, tree: Tree): IAppendPosition {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    let finalNode = nodes[nodes.length - 1];
    return { filePath, position: finalNode?.getEnd() ?? 0 };
}
