import { Observable } from 'rxjs';

export interface ICardListComponent<EntityViewModel> {
    pageSize: number;
    displayedColumns: string[];
    isPreloading$: Observable<boolean>;
    isLoading$: Observable<boolean>;
    entities$: Observable<EntityViewModel[]>;
    isEmptyList$: Observable<boolean>;
    displayTableError$: Observable<boolean>;
    totalEntitiesCount$: Observable<number>;
}