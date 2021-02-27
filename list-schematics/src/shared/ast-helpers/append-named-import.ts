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
    // ImportDeclaration -> ImportClause -> NamedImports -> ImportSpecifier -> Identifier
    // ImportDeclaration -> StringLiteral (module specifier)
    const matchingModuleImportLiteral = nodes.find(n =>
        (n.getText() === `'${verify.moduleSpecifier}'`
            || n.getText() === `"${verify.moduleSpecifier}"`)
        && n.parent.kind === ts.SyntaxKind.ImportDeclaration);
    if (matchingModuleImportLiteral) {
        const importDeclaration = matchingModuleImportLiteral.parent;
        const importClause = importDeclaration.getChildren().find(c => c.kind === ts.SyntaxKind.ImportClause);
        const namedImports = importClause?.getChildren().find(c => c.kind === ts.SyntaxKind.NamedImports);
        const specifiers = namedImports?.getChildren() as ts.Node[];
        const identifers = specifiers?.map(s => s.getChildren())
            .reduce((acc, curr) => [...acc, ...curr], []);
        const existingImportNames = identifers
            .map(n => n.getText())
            .filter(n => n !== ',');
        const missingImportSpecifiers = verify.namedImports.filter(ni => !existingImportNames?.includes(ni));
        const lastIdentifer = identifers[identifers.length - 1];
        return { position: lastIdentifer.getEnd() ?? 0, filePath, contents: `, ${missingImportSpecifiers.join(', ')}` };
    } else {
        console.log('MATCHING IMPORT NOT FOUND' + verify.moduleSpecifier);
        const importLine = `import { ${verify.namedImports.join(', ')} } from '${verify.moduleSpecifier}';`;
        const importClauses = nodes.filter(n => n.kind === ts.SyntaxKind.ImportDeclaration);
        return { position: importClauses[importClauses.length - 1]?.getEnd() ?? 0, contents: `\n${importLine}\n`, filePath };
    }
}
