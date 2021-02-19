export interface ILoadablePageInfo {
    pageIndex: number;
    pageSize: number;
}

export interface IEntityPaged {
    pageInfo: ILoadablePageInfo;
}
