import { IInsertChange, IVerifyNamespaceImport } from "../interfaces";
import { SchematicsException, Tree } from "@angular-devkit/schematics";
import ts = require("typescript");
import { getSourceNodes } from "./ast-helpers";

export function appendNamespaceImports(filePath: string, tree: Tree, verify: IVerifyNamespaceImport[]): IInsertChange[] {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    const importNodes = nodes.filter(n => n.kind === ts.SyntaxKind.NamespaceImport);
    const children = importNodes.reduce((acc, curr) => [...acc, ...curr.getChildren()], []);
    const unfoundNamespaces = verify.filter(v => !children.some(n => n.kind === ts.SyntaxKind.Identifier && n.getText() === v.namespace));
    const imports = unfoundNamespaces.map(ns => `import * as ${ns.namespace} from '${ns.moduleSpecifier}'`).join(`\n`);
    return [{ filePath, position: 0, contents: `${imports}\n` }];
}
