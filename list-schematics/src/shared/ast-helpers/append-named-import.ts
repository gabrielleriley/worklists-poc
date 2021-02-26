import { IInsertChange } from "../interfaces";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { SchematicsException } from "@angular-devkit/schematics";
import ts = require("typescript");
import { getSourceNodes } from "./ast-helpers";

export interface IVerifyNamedImport {
    namedImports: string[];
    moduleSpecifier: string;
}

export function appendNamedImports(filePath: string, tree: Tree, verify: IVerifyNamedImport): IInsertChange {
    let text = tree.read(filePath);
    if (!text) {
        throw new SchematicsException('File not found at: ' + filePath);
    }
    let sourceText = text.toString('utf-8');
    let sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let nodes: ts.Node[] = getSourceNodes(sourceFile);
    const matchingModuleNode = nodes.find(n =>
        n.kind === ts.SyntaxKind.StringLiteral
        && n.getText() === verify.moduleSpecifier
        && n.parent.kind === ts.SyntaxKind.ImportClause);
    if (matchingModuleNode) {
        const importClauseNode = matchingModuleNode.parent;
        const namedImports = importClauseNode.getChildren().find(c => c.kind === ts.SyntaxKind.NamedImports) as ts.Node;
        const importSpecifiers = namedImports.getChildren().filter(n => n.kind === ts.SyntaxKind.ImportSpecifier);
        const importSpecifierNames = importSpecifiers.map(s => s.getText());
        const missingImportSpecifiers = verify.namedImports.filter(ni => !importSpecifierNames.includes(ni));
        const lastImportSpecifier = importSpecifiers[importSpecifiers.length - 1];
        return { position: lastImportSpecifier?.getEnd() ?? 0, filePath, contents: `${missingImportSpecifiers.join(', ')}` };
    } else {
        const importLine = `import { ${verify.namedImports.join(', ')} } from '${verify.moduleSpecifier}';`;
        const importClauses = nodes.filter(n => n.kind === ts.SyntaxKind.ImportDeclaration);
        return { position: importClauses[importClauses.length - 1]?.getEnd() ?? 0, contents: `\n${importLine}\n`, filePath };
    }
}
