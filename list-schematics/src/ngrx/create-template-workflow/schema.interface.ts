export enum TemplateType {
    Reload = "Reload entities",
    ReadMultiple = "Read multiple entities",
    ReadPage = "Read page of entities",
    Create = "Create entity",
    Update = "Update entity",
    Patch = "Patch entity",
    DeleteById = "Delete entity by ID",
    OtherById = "Other by ID",
    Other = "Other"
}

export interface ITemplateWorkflowSchema {
    directory: string;
    name: string;
    isPaginated: boolean;
    hasCriteria: boolean;
    featureArea: string;
    template: TemplateType;
    actionPrefix: string;
    apiMethodName: string;
    pagedLibraryPath: string;
    statusLibraryPath: string;
}
