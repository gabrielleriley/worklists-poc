import { Action, ActionCreator, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntitySelector } from './entity-selectors';
import { IEntityKeySelector, ILoadableActionErrorTimestamp, ILoadableActionTimestamp, ILoadablePageInfo, LoadableEntityTypeKey } from './entity-state.interface';
import { EntityActionCreator, EntityPageActionCreator } from './internal-models';
import { LoadableAction } from './loadable-action.enum';

type Constructor<T> = new (...args: any[]) => T;
type StoreConstructor<T> = new (store: Store<any>, featureStateName: string) => T;

export namespace LoadableEntityFacade {
    export interface SelectorFacade<EntityType, CustomActionType = {}> {
        // Selection
        /**
         *  Returns all entities in state after the state has been loaded
         * */
        entities$: Observable<EntityType[]>;
        totalEntitiesCount$: Observable<number>;

        // Read State
        isLoaded$: Observable<boolean>;
        loadedAt$: Observable<Date>;
        loadAttemptCompleted$: Observable<boolean>;

        // In-Progress Actions
        isCreating$: Observable<boolean>;
        isLoading$: Observable<boolean>;
        isUpdating$: Observable<boolean>;
        inProgressUpdates$: Observable<ILoadableActionTimestamp[]>;
        isPatching$: Observable<boolean>;
        inProgressPatches$: Observable<ILoadableActionTimestamp[]>;
        isDeleting$: Observable<boolean>;
        inProgressDeletions$: Observable<ILoadableActionTimestamp[]>;
        isPerformingCustomActionByName(action: CustomActionType): Observable<boolean>;
        inProgressCustomActions$: Observable<ILoadableActionTimestamp<CustomActionType>[]>;

        // Error States
        hasCreateError$: Observable<boolean>;
        hasLoadError$: Observable<boolean>;
        hasUpdateError$: Observable<boolean>;
        updateErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]>;
        hasDeleteError$: Observable<boolean>;
        deleteErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]>;
        hasPatchError$: Observable<boolean>;
        patchErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]>;
        hasCustomActionErrors$: Observable<boolean>;
        customActionErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]>;
        hasCustomActionErrorByName$(name: CustomActionType): Observable<boolean>;
    }

    export interface LoadAllFacade<Criteria = {}> {
        loadAll(criteria?: Partial<Criteria>): void;
    }

    export interface LoadPageFacade<Criteria = {}> {
        loadPage(page: ILoadablePageInfo, criteria?: Partial<Criteria>): void;
    }

    export interface UpdateFacade<Entity> {
        update(entity: Entity): void;
    }

    export interface PatchFacade<Entity> {
        patch(entity: Entity): void;
    }

    export interface DeleteFacade<Entity> {
        delete(entity: Entity): void;
    }

    export interface DeleteByKeyFacade<Key extends LoadableEntityTypeKey> {
        deleteByKey(key: Key): void;
    }

    export interface RefetchFacade {
        refetch(): void;
    }

    class StateSelectorFacade<EntityType, CustomActionType = {}> implements SelectorFacade<EntityType, CustomActionType> {
        constructor(public store: Store<any>, public featureStateName: string) { }
        private entitySelectors = new EntitySelector<EntityType, CustomActionType>(this.featureStateName);
        entities$: Observable<EntityType[]> = this.store.pipe(select(this.entitySelectors.entitiesSelector));
        totalEntitiesCount$: Observable<number> = this.store.pipe(select(this.entitySelectors.totalEntitiesCount));
        isLoaded$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.completedLoadableActionType([LoadableAction.ReadAll, LoadableAction.ReadPage])));;
        loadedAt$: Observable<Date> = this.store.pipe(select(this.entitySelectors.completedLoadableActionAtTime([LoadableAction.ReadAll, LoadableAction.ReadPage])));
        isCreating$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isInProgressByType([LoadableAction.Create])));
        isLoading$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isInProgressByType([LoadableAction.ReadPage, LoadableAction.ReadAll])));
        isUpdating$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isInProgressByType([LoadableAction.Update])));
        inProgressUpdates$: Observable<ILoadableActionTimestamp<{}>[]> = this.store.pipe(select(this.entitySelectors.inProgressByType([LoadableAction.Update])));
        isPatching$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isInProgressByType([LoadableAction.Patch])));;
        inProgressPatches$: Observable<ILoadableActionTimestamp<{}>[]> = this.store.pipe(select(this.entitySelectors.inProgressByType([LoadableAction.Patch])));
        isDeleting$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isInProgressByType([LoadableAction.DeleteEntity, LoadableAction.DeleteByKey])));;
        inProgressDeletions$: Observable<ILoadableActionTimestamp<{}>[]> = this.store.pipe(select(this.entitySelectors.inProgressByType([LoadableAction.DeleteByKey, LoadableAction.DeleteEntity])));
        isPerformingCustomActionByName(name: CustomActionType): Observable<boolean> {
            return this.store.pipe(select(this.entitySelectors.isInProgressByCustomTypeName(name)))
        }
        inProgressCustomActions$: Observable<ILoadableActionTimestamp<CustomActionType>[]> = this.store.pipe(select(this.entitySelectors.inProgressByCustomType));
        hasCreateError$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isFailedByType([LoadableAction.Create])));
        hasLoadError$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isFailedByType([LoadableAction.ReadAll, LoadableAction.ReadPage])));
        hasUpdateError$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isFailedByType([LoadableAction.Update])));
        updateErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]> = this.store.pipe(select(this.entitySelectors.failedByType([LoadableAction.Update])));
        hasDeleteError$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isFailedByType([LoadableAction.DeleteByKey, LoadableAction.DeleteEntity])));
        deleteErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]> = this.store.pipe(select(this.entitySelectors.failedByType([LoadableAction.DeleteByKey, LoadableAction.DeleteEntity])));;
        hasPatchError$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isFailedByType([LoadableAction.Patch])));
        patchErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]> = this.store.pipe(select(this.entitySelectors.failedByType([LoadableAction.Patch])));;
        hasCustomActionErrors$: Observable<boolean> = this.store.pipe(select(this.entitySelectors.isFailedByType([LoadableAction.CustomAction])));
        hasCustomActionErrorByName$(name: CustomActionType): Observable<boolean> {
            return this.store.pipe(select(this.entitySelectors.isCustomActionFailedByName(name)))
        }
        customActionErrors$: Observable<ILoadableActionErrorTimestamp<CustomActionType>[]> = this.store.pipe(select(this.entitySelectors.failedByType([LoadableAction.CustomAction])));;

        loadAttemptCompleted$: Observable<boolean> = combineLatest(this.hasLoadError$, this.isLoaded$).pipe(
            map((vals) => vals.some((v) => v))
        );
    }

    export class EntityFacadeBuilder<EntityType, CustomActionType = {}> {
        constructor(
            keySelector: IEntityKeySelector
        ) { }
        private _class: Constructor<{}> = class extends StateSelectorFacade<EntityType, CustomActionType> { };

        public addLoadAllInterface<Criteria = {}>(loadAction: EntityActionCreator<EntityType[]>) {
            this._class = class extends this._class implements LoadAllFacade {
                constructor(...args: any[]) {
                    super(...args);
                }
                loadAll(criteria?: Criteria): void {
                    (this as unknown as StateSelectorFacade<EntityType, CustomActionType>).store.dispatch(loadAction({
                        loadableActionType: LoadableAction.ReadAll,
                        criteria
                    }));
                }
            };
            return this;
        }

        public addLoadPageInterface(loadAction: EntityPageActionCreator<EntityType>) {
            this._class = class extends this._class implements LoadPageFacade {
                constructor(...args: any[]) {
                    super(...args);
                }
                loadPage(page: ILoadablePageInfo, criteria?: {}): void {
                    (this as unknown as StateSelectorFacade<EntityType, CustomActionType>).store.dispatch(loadAction({
                        loadableActionType: LoadableAction.ReadPage,
                        criteria,
                        page
                    }));
                }
            };
            return this;
        }

        public addRefetchInterface(refetchAction: ActionCreator) {
            this._class = class extends this._class implements RefetchFacade {
                constructor(...args: any[]) {
                    super(...args);
                }
                refetch(): void {
                    (this as unknown as StateSelectorFacade<EntityType, CustomActionType>).store.dispatch(refetchAction() as any);
                }
            };
            return this;
        }

        public addPatchInterface(patchAction: Action): StoreConstructor<PatchFacade<EntityType>> {
            return class extends this._class implements PatchFacade<EntityType> {
                constructor(...args: any[]) {
                    super(...args);
                }
                patch(entity: EntityType): void {
                    throw new Error("Method not implemented.");
                }
            };
        }

        public addDeleteInterface(deleteEntityAction: Action): StoreConstructor<DeleteFacade<EntityType>> {
            return class extends this._class implements DeleteFacade<EntityType> {
                constructor(...args: any[]) {
                    super(...args);
                }
                delete(entity: EntityType): void {
                    throw new Error("Method not implemented.");
                }
            };
        }

        public addDeleteByKeyInterface<Key extends LoadableEntityTypeKey>(deleteEntityAction: EntityActionCreator<Key>) {
            this._class = class extends this._class implements DeleteByKeyFacade<Key> {
                constructor(...args: any[]) {
                    super(...args);
                }
                deleteByKey(key: Key): void {
                    (this as unknown as StateSelectorFacade<EntityType, CustomActionType>).store.dispatch(deleteEntityAction({
                        loadableActionType: LoadableAction.DeleteByKey,
                        payload: key,
                        identity: key
                    }));
                }
            };
            return this;
        }

        public buildFacade<T>(): StoreConstructor<T> {
            return this._class as any;
        }
    }
}


