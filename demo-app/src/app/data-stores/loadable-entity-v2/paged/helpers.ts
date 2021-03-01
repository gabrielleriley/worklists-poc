import { IEntityPageState, IEntityPageInfo } from './interfaces';

export function updatePageInfoState<State extends IEntityPageState>(
    pageInfo: Partial<IEntityPageInfo>,
    state: State,
) {
    return {
        ...state,
        pageInfo: { ...state.pageInfo, ...pageInfo },
    };
}

export function updateTotalCount<State extends IEntityPageState>(
    totalCount: number,
    state: State,
) {
    return {
        ...state,
        totalCount
    };
}
