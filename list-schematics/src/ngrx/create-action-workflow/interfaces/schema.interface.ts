export enum ActionMethod {
    Create = 'Create',
    Read = 'Read',
    Update = 'Update',
    Delete = 'Delete',
    Patch = 'Patch',
    Other = 'Other'
}

export enum ApiProperties {
    Criteria = 'Filter/Sort parameters',
    Paged = 'Page Info',
    PagedAndCriteria = 'Page Info AND Filter/Sort parameters',
    SingleEntity = 'Single Entity',
    Id = 'Single Entity ID',
    Other = 'Something Else',
    None = 'None'
}

export enum ApiResponseType {
    EntityList = "Entity list",
    Other = "Other",
    Nothing = "Nothing"
}

export interface IActionWorkflowSchema {
    pagedLibraryPath: string;
    statusLibraryPath: string;
    directory: string;
    name: string;
    actionPrefix: string;
    featureArea: string;
    method: ActionMethod;
    apiProperties: ApiProperties;
    apiResponse: ApiResponseType;
    apiMethodName: string;
}