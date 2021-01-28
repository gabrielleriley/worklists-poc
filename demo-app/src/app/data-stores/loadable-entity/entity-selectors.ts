import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ILoadableActionErrorTimestamp, ILoadableActionTimestamp, ILoadableEntityState, ILoadablePagedEntityState } from './entity-state.interface';
import { LoadableAction } from './loadable-action.enum';

interface IFullEntityState<EntityType, CustomActionType> extends
    ILoadableEntityState<EntityType, CustomActionType>,
    ILoadablePagedEntityState<EntityType, CustomActionType> { }

export class EntitySelector<EntityType, CustomActionType> {
    constructor(public stateName: string) { }

    private selectEntityState = createFeatureSelector<IFullEntityState<EntityType, CustomActionType>>(this.stateName);

    private filterByType = (arr: ILoadableActionTimestamp[], actions: LoadableAction[]) => arr.filter((a) => actions.some((action) => action === a.loadableActionType));
    public entitiesSelector = createSelector(
        this.selectEntityState,
        (state: IFullEntityState<EntityType, CustomActionType>) => {
            return (state.ids as any[]).map((id) => state.entities[id])
        }
    );

    public totalEntitiesCount = createSelector(
        this.selectEntityState,
        (s) => s.totalEntitiesCount
    )

    private completedActions = createSelector(
        this.selectEntityState,
        (state) => state.completedActions
    );

    public completedActionsByType = (actions: LoadableAction[]) => createSelector(
        this.completedActions,
        (timestamps) => this.filterByType(timestamps, actions)
    );

    public completedLoadableActionType = (actions: LoadableAction[]) => createSelector(
        this.completedActionsByType(actions),
        (ts) => ts.length > 0
    );

    public completedLoadableActionAtTime = (actions: LoadableAction[]) => createSelector(
        this.completedActionsByType(actions),
        (ts) => ts.length > 0 ? ts.map(t => t.timestamp).sort()[0] : null
    );

    private inProgressActions = createSelector(
        this.selectEntityState,
        (s) => s.inProgressActions
    )

    public inProgressByType = (actions: LoadableAction[]) => createSelector(
        this.inProgressActions,
        (timestamps: ILoadableActionTimestamp[]) => this.filterByType(timestamps, actions)
    );

    public isInProgressByType = (actions: LoadableAction[]) => createSelector(
        this.inProgressByType(actions),
        (arr) => arr.length > 0
    );

    public inProgressByCustomType = createSelector(
        this.inProgressByType([LoadableAction.CustomAction]),
        (timestamps: ILoadableActionTimestamp<CustomActionType>[]) => timestamps.filter((m) => m.nonCrudActionTypeName === name)
    );

    public inProgressByCustomTypeName = (name: CustomActionType) => createSelector(
        this.inProgressByCustomType,
        (timestamps) => timestamps.filter(ts => ts.nonCrudActionTypeName === name)
    );

    public isInProgressByCustomTypeName = (name: CustomActionType) => createSelector(
        this.inProgressByCustomTypeName(name),
        ts => ts.length > 0
    );

    private failedActions = createSelector(
        this.selectEntityState,
        s => s.failedActions
    );

    public failedByType = (actions: LoadableAction[]) => createSelector(
        this.failedActions,
        s => this.filterByType(s, actions) as ILoadableActionErrorTimestamp<CustomActionType>[]
    );

    public isFailedByType = (actions: LoadableAction[]) => createSelector(
        this.failedByType(actions),
        arr => arr.length > 0
    );

    public isCustomActionFailedByName = (name: CustomActionType) => createSelector(
        this.failedByType([LoadableAction.CustomAction]),
        (arr: ILoadableActionErrorTimestamp<CustomActionType>[]) => arr.filter(a => a.nonCrudActionTypeName === name),
        arr => arr.length > 0
    );

    public criteria = createSelector(
        this.selectEntityState,
        (state) => state.criteria
    );

    public currentPage = createSelector(
        this.selectEntityState,
        (state) => state.currentPage
    );
}