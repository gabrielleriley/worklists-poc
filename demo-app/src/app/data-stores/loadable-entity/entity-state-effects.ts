import { InjectionToken, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, select, Store } from '@ngrx/store';
import { merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { ILoadableActionProps, ILoadablePagedActionProps } from './entity-actions';
import { EntitySelector } from './entity-selectors';
import { IEntityErrorPayload, ILoadableEntityService, IPagedPayload } from './entity-service.interface';
import { IEntityKeySelector, LoadableEntityTypeKey } from './entity-state.interface';
import { EntityActionCreator, EntityPageActionCreator } from './internal-models';
import { LoadableAction } from './loadable-action.enum';

export function createEffectsHelperToken(featureName: string) {
    return new InjectionToken(`Entity Effects Helper: ${featureName}`)
}

export function provideEntityEffectsHelper(stateName: string, keySelector: IEntityKeySelector, token: InjectionToken<string>, token2: InjectionToken<any>) {
    return {
        provide: token,
        useFactory: (actions: Actions, store: Store<any>, injector: Injector) => {
            const service = injector.get(token2);
            return new EntityEffectsHelper(actions, service, store, stateName, keySelector);
        },
        deps: [Actions, Store, Injector]
    }
}

// TODO: allow partials for load effects
export class EntityEffectsHelper<Entity> {
    constructor(
        private actions: Actions,
        private entityService: ILoadableEntityService<Entity, {}>,
        private store: Store<any>,
        private stateName: string,
        private keySelector: IEntityKeySelector
    ) { }

    private selectors = new EntitySelector<Entity, {}>(this.stateName);
    private implementedEntityServiceMethods = Object.getOwnPropertyNames(Reflect.getPrototypeOf(this.entityService));

    private checkForServiceMethod(name: string) {
        const res = this.implementedEntityServiceMethods.find((m) => m === name);
        if (!res) {
            console.warn(`
            Entity Effects Helper expected to find implemented service method: ${name}. 
            Check that this method exists in the service implementing the IEntityService interface.`);
        }
    }

    public createEntityLoadAllEffect({ triggerAction, successAction, errorAction, debounceMs = 250 }
        : { triggerAction: EntityActionCreator<Entity[]>; successAction: EntityActionCreator<Entity[]>, errorAction: EntityActionCreator<Entity[]>, debounceMs?: number }) {
        this.checkForServiceMethod('loadAll');
        return createEffect(() => {
            return this.actions.pipe(
                ofType(triggerAction),
                debounceTime(debounceMs ?? 250),
                withLatestFrom(this.store.select(this.selectors.criteria)),
                switchMap(([_, criteria]: [ILoadableActionProps<Entity[]>, {}]) => this.entityService.loadAll(criteria)),
                map((response: Entity[] | IEntityErrorPayload) => {
                    if (Array.isArray(response)) {
                        return successAction({
                            loadableActionType: LoadableAction.ReadAll,
                            payload: response,
                        })
                    } else {
                        return errorAction({ loadableActionType: LoadableAction.ReadAll, errorMessage: response.errorMessage, payload: undefined });
                    }
                }),
                catchError(() => of(errorAction({ loadableActionType: LoadableAction.ReadAll, errorMessage: 'Uncaught Exception', payload: undefined })))
            )
        }, {});
    }

    public createEntityLoadPageEffect({ triggerAction, successAction, errorAction, debounceMs }
        : {
            triggerAction: EntityPageActionCreator<Entity>; successAction: EntityPageActionCreator<Entity>,
            errorAction: EntityPageActionCreator<Entity>, debounceMs?: number
        }) {
        this.checkForServiceMethod('loadPage');
        return createEffect(() => {
            return this.actions.pipe(
                ofType(triggerAction),
                debounceTime(debounceMs ?? 250),
                withLatestFrom(this.store.select(this.selectors.criteria)),
                switchMap(([action, criteria]: [ILoadablePagedActionProps<Entity[]>, {}]) => this.entityService.loadPage(action.page, criteria).pipe(
                    map((response: IPagedPayload<Entity> | IEntityErrorPayload) => {
                        const errorMessage = (response as IEntityErrorPayload).errorMessage;
                        if (errorMessage) {
                            return errorAction({
                                loadableActionType: LoadableAction.ReadPage,
                                payload: undefined,
                                errorMessage: errorMessage,
                                page: action.page,
                                totalEntitiesCount: undefined
                            });
                        } else {
                            const payload = response as IPagedPayload<Entity>;
                            return successAction({
                                loadableActionType: LoadableAction.ReadPage,
                                payload: payload.entities,
                                page: payload.page,
                                totalEntitiesCount: payload.totalCount
                            });
                        }
                    }),
                    catchError((err) => {
                        return of(errorAction({
                            loadableActionType: LoadableAction.ReadPage,
                            payload: undefined,
                            errorMessage: 'Uncaught Exception',
                            page: action.page,
                            totalEntitiesCount: undefined
                        }))
                    })
                )),
            )
        });
    }

    public createEntityCreateEffect({ triggerAction, successAction, errorAction }
        : { triggerAction: EntityActionCreator<Entity>; successAction: EntityActionCreator<Entity>, errorAction: EntityActionCreator<Entity> }) {
        this.checkForServiceMethod('create');
        return this.createMergedEntityEffect<Entity>({ triggerAction, successAction, errorAction, actionType: LoadableAction.Create, serviceMethod: this.entityService.create });
    }

    public createEntityUpdateEffect({ triggerAction, successAction, errorAction }
        : { triggerAction: EntityActionCreator<Entity>; successAction: EntityActionCreator<Entity>, errorAction: EntityActionCreator<Entity> }) {
        this.checkForServiceMethod('update');
        return this.createMergedEntityEffect<Entity>({ triggerAction, successAction, errorAction, actionType: LoadableAction.Update, serviceMethod: this.entityService.update });
    }

    public createEntityPatchEffect({ triggerAction, successAction, errorAction }
        : { triggerAction: EntityActionCreator<Entity>; successAction: EntityActionCreator<Entity>, errorAction: EntityActionCreator<Entity> }) {
        this.checkForServiceMethod('patch');
        return this.createMergedEntityEffect<Entity>({ triggerAction, successAction, errorAction, actionType: LoadableAction.Patch, serviceMethod: this.entityService.patch });
    }

    public createEntityDeleteEffect({ triggerAction, successAction, errorAction }
        : { triggerAction: EntityActionCreator<Entity>; successAction: EntityActionCreator<Entity>, errorAction: EntityActionCreator<Entity> }) {
        this.checkForServiceMethod('delete');
        return this.createMergedEntityEffect<Entity>({ triggerAction, successAction, errorAction, actionType: LoadableAction.DeleteEntity, serviceMethod: this.entityService.delete });
    }

    public createEntityDeleteByKeyEffect({ triggerAction, successAction, errorAction }
        : { triggerAction: EntityActionCreator<LoadableEntityTypeKey>; successAction: EntityActionCreator<LoadableEntityTypeKey>, errorAction: EntityActionCreator<LoadableEntityTypeKey> }) {
        this.checkForServiceMethod('deleteByKey');
        return this.createMergedEntityEffect<LoadableEntityTypeKey>({ triggerAction, successAction, errorAction, actionType: LoadableAction.DeleteEntity, serviceMethod: this.entityService.deleteByKey });
    }

    public createRefetchAllEffect(refetchAfter: ActionCreator[], fetchAllAction: EntityActionCreator<Entity[]>) {
        const refetchTriggers = merge(
            ...refetchAfter.map((a) => this.actions.pipe(ofType(a)))
        );
        return createEffect(() => refetchTriggers.pipe(
            withLatestFrom(this.store.pipe(select(this.selectors.criteria))),
            map(([_, criteria]) => {
                return fetchAllAction({
                    loadableActionType: LoadableAction.ReadAll,
                    payload: undefined,
                    criteria
                });
            })
        ));
    }

    public createRefetchPageEffect(refetchAfter: ActionCreator[], fetchPageAction: EntityPageActionCreator<Entity>) {
        const refetchTriggers = merge(
            ...refetchAfter.map((a) => this.actions.pipe(ofType(a)))
        );
        return createEffect(() => refetchTriggers.pipe(
            withLatestFrom(
                this.store.pipe(select(this.selectors.criteria)),
                this.store.pipe(select(this.selectors.currentPage))
            ),
            map(([_, criteria, page]) => {
                return fetchPageAction({
                    loadableActionType: LoadableAction.ReadAll,
                    payload: undefined,
                    criteria,
                    page,
                });
            })
        ));
    }

    private createMergedEntityEffect<Payload>({ triggerAction, successAction, errorAction, actionType, serviceMethod }
        : {
            triggerAction: EntityActionCreator<Payload>; successAction: EntityActionCreator<Payload>, errorAction: EntityActionCreator<Payload>,
            actionType: LoadableAction, serviceMethod: (entity: Payload) => Observable<Payload | IEntityErrorPayload>
        }) {
        return createEffect(() => {
            return this.actions.pipe(
                ofType(triggerAction),
                mergeMap((action: ILoadableActionProps<Payload>) => serviceMethod(action.payload).pipe(
                    map((response: Payload | IEntityErrorPayload) => {
                        const errorMessage = (response as IEntityErrorPayload).errorMessage;
                        const identity = typeof action.payload === 'object' ? this.keySelector(action.payload) : action.payload as unknown as LoadableEntityTypeKey;
                        if (!errorMessage) {
                            return successAction({
                                loadableActionType: actionType,
                                payload: undefined,
                                identity
                            });
                        } else {
                            return errorAction({
                                loadableActionType: actionType,
                                payload: undefined,
                                errorMessage: errorMessage,
                                identity
                            } as any);
                        }
                    }),
                    catchError(() => of(errorAction({ loadableActionType: actionType, errorMessage: 'Uncaught Exception', payload: undefined })))
                )),                
            )
        });
    }
}
