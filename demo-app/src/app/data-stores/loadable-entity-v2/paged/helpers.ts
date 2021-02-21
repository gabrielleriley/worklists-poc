import { IEntityPagedState } from './interfaces';
import { ILoadablePageInfo } from '@app/data-stores/loadable-entity/entity-state.interface';

export function updatePaginationState<State extends IEntityPagedState>(
    state: State,
    pageInfo: Partial<ILoadablePageInfo>,
    totalCount: number = 0
): State {
    return {
        ...state,
        pageInfo: { ...state.pageInfo, ...pageInfo },
        totalCount
    };
}
