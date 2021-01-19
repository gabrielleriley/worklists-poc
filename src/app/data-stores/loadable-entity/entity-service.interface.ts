import { ILoadablePageInfo, LoadableEntityTypeKey } from './entity-state.interface';
import { Observable } from 'rxjs';

export interface IEntityErrorPayload {
    errorMessage: string;
}

export interface IPagedPayload<EntityType> {
    entities: EntityType[],
    page: ILoadablePageInfo,
    totalCount: number;
}

export interface IEntityService<EntityType, Criteria = {}> {
    load?(key: LoadableEntityTypeKey): Observable<EntityType | IEntityErrorPayload>;
    loadAll?(criteria?: Criteria): Observable<EntityType[] | IEntityErrorPayload>;
    loadPage?(page: ILoadablePageInfo, criteria?: Criteria): Observable<IPagedPayload<EntityType> | IEntityErrorPayload>;

    create?(entity: EntityType): Observable<EntityType | IEntityErrorPayload>;
    update?(entity: EntityType): Observable<EntityType | IEntityErrorPayload>;
    patch?(entity: Partial<EntityType>): Observable<EntityType | IEntityErrorPayload>;
    delete?(entity: EntityType): Observable<EntityType | IEntityErrorPayload>;
    deleteByKey?(key: LoadableEntityTypeKey): Observable<LoadableEntityTypeKey | IEntityErrorPayload>;
}