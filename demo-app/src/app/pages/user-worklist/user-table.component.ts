import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PersistedTableSelections } from '@app/utils/filter-form-groups';
// import { onlyContainsValue } from '@app/utils/pipes';
import { IFormGroup } from '@rxweb/types';
import { ICardListComponent } from '@app/utils/interfaces';
import { combineLatest, merge, Observable, Subject, BehaviorSubject } from 'rxjs';
import { first, flatMap, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { UserPreferenceService, IUserPreference } from './user-preference.service';
import { NationalityFacade } from '@app/data-stores/nationality';
import { IUserQueryCriteria, UserFacade } from '@app/data-stores/user';

// TODO: REMOVE ME once you've setup your component!
class MockEntityFacade {
    public loadAttemptCompleted$ = new BehaviorSubject(false);
    public isLoading$ = new BehaviorSubject(false);
    public entities$ = new BehaviorSubject([{ id: 1, name: 'Bailey' }, { id: 2, name: 'Cooper' }]);
    public totalEntitiesCount$ = new BehaviorSubject(2);
    public hasLoadError$ = new BehaviorSubject(false);
    public loadPage(...args) { 
        this.loadAttemptCompleted$.next(true);
    }
    public loadAll(...args) { 
        this.loadAttemptCompleted$.next(true);
    }
    public refetch() { }
}

interface IUserTableRow {
    id: string | number;
    firstName: string;
    lastName: string,
    gender: string;
    email: string;
    nationality: string;
}

interface ISearchForm {
    nationalities: string[];
    gender: string;
    lastName: string;
}

@Component({
    selector: 'app-user-table',
    templateUrl: 'user-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: 'table', useFactory: () => new MockEntityFacade()}, MockEntityFacade] // TODO: Remove this row once you've setup your component
})
export class UserTableComponent implements ICardListComponent<IUserTableRow>, OnInit, AfterViewInit, OnDestroy {
    constructor(
        private formBuilder: FormBuilder,
        // TODO: Replace these mock facades with your actual facades
        // TODO: remove @Inject decorator once table data is provided
        // @Inject('table') private tableDataFacade: UserFacade,
        // Note: If you have multiple select filters, you will have multiple 
        private tableDataFacade: UserFacade,
        private nationalityFacade: NationalityFacade,
        private preferenceService: UserPreferenceService
    ) { }

    @ViewChild(MatSort) public matSort: MatSort;
    @ViewChild(MatPaginator) public matPaginator: MatPaginator;

    private destroyed$ = new Subject<void>();
    // The displayedColumns property determines what order table columns display
    public readonly displayedColumns = ['select','actions','id','firstName','lastName','gender','email','nationality'];
    public readonly pageSize = 12;
    public tableForm = new PersistedTableSelections();
    public searchForm = <IFormGroup<ISearchForm>>this.formBuilder.group({
        nationalities: new FormControl([]),
        gender: new FormControl(''),
        lastName: new FormControl(''),
    });

    // Async loaded select filter data sources
    public nationalities$ = this.nationalityFacade.entities$;
    public otherData$ = this.nationalityFacade.entities$;

    // Wait until all filters have attempted to load at least once
    // We will consider the filter loaded even if the attempt fails to avoid having holding up form if a filter dropdown's data fails for some reason
    private filtersLoaded$: Observable<boolean> = this.nationalityFacade.loadAttemptCompleted$

    // Preloading indicates that the first data load hasn't been performed yet, so we don't want to display anything in the card besides a spinner
    public isPreloading$: Observable<boolean> = this.tableDataFacade.loadAttemptCompleted$.pipe(
        map(loaded => !loaded)
    );
    public isLoading$: Observable<boolean> = this.tableDataFacade.isLoading$;

    public entities$: Observable<IUserTableRow[]> = combineLatest(
            [this.tableDataFacade.entities$,
            this.nationalityFacade.entities$]
        )
        .pipe(
            tap(([tableData,nationalityData]) => {
                const ids = tableData.map((e) => e.id);
                this.tableForm.addControlsForIds(ids);
            }),
            map(([tableData, nationalityData]) => {
                // map your state entities to your table row VM
                return tableData.map((e) => ({ 
                        id: e.id, 
                        firstName: e.name.first,
                        lastName: e.name.last,
                        gender: e.gender,
                        email: e.email,
                        nationality: e.nationality,
                    })
                )}
            )
        )

    public totalEntitiesCount$: Observable<number> = this.tableDataFacade.totalEntitiesCount$;
    public isEmptyList$ = this.totalEntitiesCount$.pipe(map((cnt) => cnt === 0));
    public displayTableError$: Observable<boolean> = this.tableDataFacade.hasLoadError$;

    public ngOnInit() {
        // Selectable filter data (locations, users, etc) will usually be loaded from a non-paginated data store
        this.nationalityFacade.loadAll();
        // this.otherDataFacade.loadAll();
        // Once the filter data is loaded in, load in the table data
        
        this.filtersLoaded$.pipe(
            first(),
            flatMap(() => this.preferenceService.getPreference().pipe(
                tap((preference) => this.setPreferredFilters(preference))
            ))
        ).subscribe((preference: IUserPreference) => {
            this.tableDataFacade.loadPage({ pageIndex: 0, pageSize: this.pageSize }, preference ? { 
                // TODO: Map your preference object into your search criteria interface
                // This is also the time to include any other default criteria settings!
            } : undefined);
        });
    }

    public ngAfterViewInit() {
        this.monitorAndSaveFilterPreferences();
        merge(
            this.matPaginator.page.pipe(map(() => ({}))), //ideally do a combineLatest with two streams see notes...
            // this.matSort.sortChange.pipe(map((sortChange) => {
            //     // Map the sort change object into a partial of your criteria interface, if needed. 
            //     // Otherwise, remove this map pipe.
            //     // return sortChange;
            //     return sortChange
            // })),
            this.matSort.sortChange.pipe(map((sortChange) => {
                return {
                    sortColumn: sortChange.active,
                    direction: sortChange.direction
                }
            })),
            // this.searchForm.valueChanges.pipe(map((formValue) => {
            //     // Map the form value into a partial of your criteria interface, if needed. 
            //     // Otherwise, remove this map pipe.
            //     return formValue;
            // }))
            this.searchForm.valueChanges.pipe(map((formValue) => {
                return {
                    nationalities: formValue.nationalities,
                    gender: formValue.gender,
                    lastName: formValue.lastName
                };
            }))
        ).subscribe((change: Partial<IUserQueryCriteria>) => {
            // TODO: ^ change <any> to the table entity's query criteria interface
            this.tableDataFacade.loadPage({ pageIndex: this.matPaginator.pageIndex, pageSize: this.matPaginator.pageSize }, change);
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next();
    }

    public clearFilters() {
        this.searchForm.setValue({
            nationalities: [],
            gender: '',
            lastName: '',
        });
    }

    public retry() {
        this.tableDataFacade.refetch();
    }
    
    private setPreferredFilters(preference: IUserPreference) {
        if (preference) {
            this.searchForm.patchValue({
                nationalities: preference.nationalities,
                gender: preference.gender,
                lastName: preference.lastName
            });
        }
    }

    private monitorAndSaveFilterPreferences() {
        this.searchForm.valueChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((formValue) => {
            this.preferenceService.setPreference({
                nationalities: formValue.nationalities,
                gender: formValue.gender,
                lastName: formValue.lastName
            });
        });
    }
    
    public deleteUser(id: string) {
        this.tableDataFacade.deleteByKey(id);
        console.log(`Hi from row: ${id}!`);
    }
    
}