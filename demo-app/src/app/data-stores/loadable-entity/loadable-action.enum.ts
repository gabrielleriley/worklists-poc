export enum LoadableAction {
    Create = 'Create - Loadable Entity',
    ReadAll = 'Read All - Loadable Entity',
    ReadPage = 'Read Page - Loadable Entity',
    Update = 'Update - Loadable Entity',
    Patch = 'Patch - Loadable Entity',
    DeleteEntity = 'Delete by Entity - Loadable Entity',
    DeleteByKey = 'Delete by Key - Loadable Entity',
    CustomAction = 'Custom Action - Loadable Entity', // All custom actions should use this type
}