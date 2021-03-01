import { SchematicsException } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { IAppendPosition } from "../interfaces";
import * as ts from 'typescript';
import { getSourceNodes } from "./ast-helpers";

export function appendTestsToSpecFile(filePath: string, tree: Tree): IAppendPosition {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    let firstDescribeIdentifier = nodes.find(n => n.kind === ts.SyntaxKind.Identifier && n.getText() === 'describe');
    if (!firstDescribeIdentifier) {
        throw new SchematicsException(`Cannot append specs. No describe found in ${filePath}`);
    }
    // CallExpression -> Arrow Function -> Block -> ExpressionStatement list
    const testCallExpression = firstDescribeIdentifier.parent;
    const syntaxList = testCallExpression.getChildren().find(c => c.kind === ts.SyntaxKind.SyntaxList);
    const arrowFn = syntaxList?.getChildren().find(c => c.kind === ts.SyntaxKind.ArrowFunction);
    const arrowFnBlock = arrowFn?.getChildren().find(c => c.kind === ts.SyntaxKind.Block);
    const blockSyntaxList = arrowFnBlock?.getChildren().find(c => c.kind === ts.SyntaxKind.SyntaxList);
    const expressionStatements = blockSyntaxList?.getChildren().filter(c => c.kind === ts.SyntaxKind.ExpressionStatement);
    const lastExpressionStatement = expressionStatements?.reverse()[0];
    const position = lastExpressionStatement !== undefined ? lastExpressionStatement?.getEnd() : (arrowFnBlock?.getStart() ?? 0) + 1;
    return { filePath, position };
}
