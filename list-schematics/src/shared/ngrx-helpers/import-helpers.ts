export const ENTITY_PAGE = 'EntityPage';
export const ENTITY_STATUS = 'EntityStatus';

export enum EntityPageProperty {
    CurrentPageInfoSelector = 'currentPageInfo',
    CurrentPageIndexSelector = 'currentPageIndex',
    CurrentPageSizeSelector = 'currentPageSize',
    CurrentCountSelector = 'totalCount',
    PageInfoInterface = 'IEntityPageInfo',
    PageStateInterface = 'IEntityPageState',
    PagedPayloadInterface = 'IPagedEntityPayload',
    UpdatePageInfoFn = 'updatePageInfoState',
    UpdateCntFn = 'updateTotalCount'
}

export enum EntityStatusProperty {
    ResourceMethodEnum = 'EntityResourceMethod',
    TimestampDefInterface = 'IEntityTimestampDefinition',
    TimestampInterface = 'IEntityActionTimestamp',
    StatusStateInterface= 'IEntityStatusState',
    PayloadInterface = 'IEntityPayload',
    OnCancelableTriggerFn = 'updateStatusStateOnCancelableTrigger',
    OnTriggerFn = 'updateStatusStateOnTrigger',
    OnSuccessFn = 'updateStatusStateOnSuccess',
    OnFailureFn = 'updateStatusStateOnFailure'
}

export enum ResourceMethodEnumEntry {
    Create = 'Create',
    Read = 'Read',
    Update = 'Update',
    Delete = 'Delete',
    Patch = 'Patch',
    Action = 'Action'
}

export function getEntityPageImport(filePath: string) {
    return `import * as ${ENTITY_PAGE} from '${filePath}'`;
}

export function getEntityStatusImport(filePath: string) {
    return `import * as ${ENTITY_STATUS} from '${filePath}'`;
}

export function getEntityPageProperty(prop: EntityPageProperty) {
    return `${ENTITY_PAGE}.${prop}`
}

export function getEntityStatusProperty(prop: EntityStatusProperty) {
    return `${ENTITY_STATUS}.${prop}`;
}