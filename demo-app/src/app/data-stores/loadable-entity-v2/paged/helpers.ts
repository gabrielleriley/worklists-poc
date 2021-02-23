import { IEntityPagedState } from './interfaces';
import { ILoadablePageInfo } from '@app/data-stores/loadable-entity/entity-state.interface';

export function updatePageInfoState<State extends IEntityPagedState>(
    pageInfo: Partial<ILoadablePageInfo>,
    state: State,
) {
    return {
        ...state,
        pageInfo: { ...state.pageInfo, ...pageInfo },
    };
}

export function updateTotalCount<State extends IEntityPagedState>(
    totalCount: number,
    state: State,
) {
    return {
        ...state,
        totalCount
    };
}
