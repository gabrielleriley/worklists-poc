import { IEntityPageState } from './interfaces';

export const currentPageInfo = (state: IEntityPageState) => state?.pageInfo;
export const currentPageIndex = (state: IEntityPageState) => state?.pageInfo?.pageIndex ?? 0;
export const currentPageSize = (state: IEntityPageState) => state?.pageInfo?.pageSize ?? 0;
export const totalCount = (state: IEntityPageState) => state?.totalCount ?? 0;
