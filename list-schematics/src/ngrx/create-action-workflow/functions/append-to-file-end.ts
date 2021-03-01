import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { InsertChange } from "../interfaces";
import { SchematicsException } from "@angular-devkit/schematics";
import * as ts from 'typescript';
import * as Helpers from '../../functions';

export function appendToFileEnd(filePath: string, tree: Tree): InsertChange {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = Helpers.getSourceNodes(sourceFile);
    let finalNode = nodes[nodes.length - 1];
    return { filePath, position: finalNode?.getEnd() ?? 0 };
}