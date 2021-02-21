export interface ILoadablePageInfo {
    pageIndex: number;
    pageSize: number;
}

export interface IEntityPagedState {
    totalNumberEntities: number;
    pageInfo: ILoadablePageInfo;
}
