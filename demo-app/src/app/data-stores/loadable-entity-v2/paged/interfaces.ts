export interface ILoadablePageInfo {
    pageIndex: number;
    pageSize: number;
}

export interface IEntityPagedState {
    totalCount: number;
    pageInfo: ILoadablePageInfo;
}

export interface IPagedEntityPayload<T> {
    totalCount: number;
    entities: T[];
}
