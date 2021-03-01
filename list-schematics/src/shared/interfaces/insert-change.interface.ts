export interface IAppendPosition {
    filePath: string;
    position: number;
}

export interface IInsertChange {
    filePath: string;
    position: number;
    contents: string;
}

export interface IVerifyNamespaceImport {
    namespace: string;
    moduleSpecifier: string;
}

export interface IVerifyNamedImport {
    names: string[];
    moduleSpecifier: string;
}

export interface IVerifyImports {
    namespaceImports?: IVerifyNamespaceImport[];
    namedImports?: IVerifyNamedImport[];
}
