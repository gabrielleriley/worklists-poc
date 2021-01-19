import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IPersonEntityQueryCriteria } from '@app/data-stores/basic/people';
import { PersonFacade } from '@app/data-stores/basic/people/person-entity.facade';
import { onlyContainsValue } from '@app/utils/pipes';
import { Store } from '@ngrx/store';
import { IFormGroup } from '@rxweb/types';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { delay, first, flatMap, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { IPersonFilterPreference, PersonFilterPreferenceMockService } from '../person-filter-preference.service';
import { IPersonSearchForm, IPersonTableRow, mapEntitiesToVM } from '../person-table-row.model';
import { NationalityFacade } from '@app/data-stores/basic/nationalities/nationality.facade';

interface ICardListComponent<EntityViewModel> {
    pageSize: number;
    displayedColumns: string[];
    isPreloading$: Observable<boolean>;
    isLoading$: Observable<boolean>;
    entities$: Observable<EntityViewModel[]>;
    isEmptyList$: Observable<boolean>;
    displayTableError$: Observable<boolean>;
    totalEntitiesCount$: Observable<number>;
}


@Component({
    selector: 'app-person-entity-worklist',
    templateUrl: './person-entity-worklist.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonEntityWorklistDemoComponent implements ICardListComponent<IPersonTableRow>, OnInit, AfterViewInit, OnDestroy {
    constructor(
        private preferenceService: PersonFilterPreferenceMockService,
        private formBuilder: FormBuilder,
        private natFacade: NationalityFacade,
        public personFacade: PersonFacade,
        private store: Store<any> // TODO: remove
    ) { }

    @ViewChildren(MatSort) public matSort: QueryList<MatSort>;
    @ViewChildren(MatPaginator) public matPaginator: QueryList<MatPaginator>;

    private destroyed$ = new Subject<void>();
    public readonly displayedColumns = ['select','id', 'firstName', 'lastName', 'email', 'nationality'];
    public readonly pageSize = 2;


    private nationalities$ = this.natFacade.entities$;
    private filtersLoaded$ = combineLatest(
        this.natFacade.loadAttemptCompleted$
    ).pipe(onlyContainsValue(true));

    isPreloading$ = this.personFacade.loadAttemptCompleted$.pipe(
        map(loaded => !loaded)
    );

    isLoading$: Observable<boolean> = this.personFacade.isLoading$;
    entities$: Observable<IPersonTableRow[]> = this.personFacade.entities$.pipe(
        withLatestFrom(this.nationalities$),
        map(([people, nats]) => mapEntitiesToVM(people, nats))
    );
    totalEntitiesCount$: Observable<number> = this.personFacade.totalEntitiesCount$;
    isEmptyList$: Observable<boolean> = this.totalEntitiesCount$.pipe(map((cnt) => cnt === 0));
    displayTableError$: Observable<boolean> = this.personFacade.hasLoadError$;

    searchForm = <IFormGroup<IPersonSearchForm>>this.formBuilder.group({
        nationalities: new FormControl([]),
        genders: new FormControl([]),
        lastName: new FormControl(''),
    });

    ngOnInit() {
        this.natFacade.loadAll();
        this.filtersLoaded$.pipe(
            first(),
            flatMap(() => this.preferenceService.getPreference().pipe(
                tap((pref) => this.setPreferredFilters(pref))
            ))
        ).subscribe((pref: IPersonFilterPreference) => {
            this.personFacade.loadPage({ pageIndex: 0, pageSize: this.pageSize }, pref ? { 
                nationalities: pref.nationalityCodes,
                genders: pref.genders, 
                lastName: pref.lastName 
            } : undefined);
        });
    }

    ngAfterViewInit(): void {
        this.store.subscribe((state) => {
            console.log(state);
        });
        this.monitorAndSaveFilterPreferences();
        merge(
            this.matPaginator.first.page,
            this.matSort.first.sortChange.pipe(map((change) => ({ sortColumn: change.active, order: change.direction }))),
            this.searchForm.valueChanges
        ).subscribe((change: Partial<IPersonEntityQueryCriteria>) => {
            this.personFacade.loadPage({ pageIndex: this.matPaginator.first.pageIndex, pageSize: this.matPaginator.first.pageSize }, change);
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
    }

    public clearFilters() {
        this.searchForm.setValue({
            nationalities: [],
            lastName: '',
            genders: [],
            selections: []
        });
    }

    private setPreferredFilters(preference: IPersonFilterPreference) {
        if (preference) {
            this.searchForm.patchValue({
                genders: preference.genders,
                nationalities: preference.nationalityCodes,
                lastName: preference.lastName
            });
        }
    }

    private monitorAndSaveFilterPreferences() {
        this.searchForm.valueChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((formValue) => {
            this.preferenceService.setPreference({
                nationalityCodes: formValue.nationalities,
                genders: formValue.genders,
                lastName: formValue.lastName
            });
        });
    }
}