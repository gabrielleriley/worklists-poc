import { IEntityPagedState } from './interfaces';

export const currentPageIndex = (state: IEntityPagedState) => state?.pageInfo?.pageIndex ?? 0;
export const currentPageSize = (state: IEntityPagedState) => state?.pageInfo?.pageSize ?? 0;
export const totalCount = (state: IEntityPagedState) => state?.totalCount;
