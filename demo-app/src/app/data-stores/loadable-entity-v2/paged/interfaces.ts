export interface IEntityPageInfo {
    pageIndex: number;
    pageSize: number;
}

export interface IEntityPageState {
    totalCount: number;
    pageInfo: IEntityPageInfo;
}

export interface IPagedEntityPayload<T> {
    totalCount: number;
    entities: T;
    errorMessage?: string;
}
