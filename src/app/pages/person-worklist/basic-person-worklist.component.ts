import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { IPersonRequestDTO, PersonSortColumnDTO } from '@app/api-models';
import { NationalityAutoFacade } from '@app/data-stores/auto-entity/nationalities';
import { PersonAutoEntityFacade } from '@app/data-stores/auto-entity/people';
import { containsValuePipe as arrayContainsValuePipe, containsValuePipe } from '@app/utils/pipes';
import { IFormGroup } from '@rxweb/types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, map, mapTo, startWith, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { IPersonSearchForm, IPersonTableRow, mapAutoEntitiesToVM } from './person-table-row.model';
import { PersonFilterPreferenceMockService, IPersonFilterPreference } from './person-filter-preference.service';

/**
 * AC:
 * - List should remember preferred filter values
 * - List shouldn't show preferred filter values "pop in"
 * - Pagination, filtering, sorting 
 */

/**
 * Functionality:
 * X Async pipe for all observable data
 * X Combining stores for table VM
 * X Pagination
 * X Filtering
 * X "Remembered" filter settings
 * X Type-safe formgroup via rxweb/types
 * - Sorting
 * - "Remembered" sorting settings
 * - Item actions
 */
@Component({
    selector: 'app-basic-person-worklist',
    templateUrl: './person-worklist.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPersonWorklistComponent implements AfterViewInit, OnDestroy {
    constructor(
        public personFacade: PersonAutoEntityFacade,
        public natFacade: NationalityAutoFacade,
        public preferenceService: PersonFilterPreferenceMockService,
        public formBuilder: FormBuilder,
    ) { }

    @ViewChildren(MatSort) public matSort: QueryList<MatSort>;
    @ViewChildren(MatPaginator) public matPaginator: QueryList<MatPaginator>;

    // Basic setup stuff
    private destroyed = new Subject<void>();
    public searchForm = <IFormGroup<IPersonSearchForm>>this.formBuilder.group({
        nationalityCodes: new FormControl([]),
        genders: new FormControl([]),
        lastName: new FormControl('')
    });
    // Loading States
    private filterDataLoading$ = combineLatest(
        this.natFacade.loadedAt$.pipe(
            map((loadedDate: Date) => !loadedDate)
        ),
        this.preferenceService.getPreference().pipe(
            tap((p) => this.setPreferredFilters(p)),
            mapTo(false),
            startWith(true)
        )
    ).pipe(containsValuePipe(true));
    public isLoading$ = this.personFacade.isLoading$;

    private readyToLoadTableData$ = this.filterDataLoading$.pipe(
        filter((loading) => !loading),
        first(),
    );
    public firstLoadComplete$ = this.personFacade.isLoading$.pipe(
        filter((l) => l),
        first(),
        switchMap(() => this.personFacade.isLoading$),
        filter(l => !l),
        first(),
        mapTo(true)
    )

    // Table data
    public readonly displayedColumns = ['id', 'firstName', 'lastName', 'email', 'nationality'];
    public nationalities$ = this.natFacade.all$;
    public entities$: Observable<IPersonTableRow[]> = this.personFacade.all$.pipe(
        withLatestFrom(this.nationalities$),
        map(([people, nats]) => mapAutoEntitiesToVM(people, nats))
    );
    public totalNumEntities$ = this.personFacade.totalPageable$;

    public ngAfterViewInit(): void {
        // Filter, Sorting, Pagination
        this.natFacade.loadAll();
        this.readyToLoadTableData$.pipe(
            switchMap(() => {
                return combineLatest(
                    this.matPaginator.first.page.pipe(
                        startWith({ pageSize: this.matPaginator.first.pageSize, pageIndex: this.matPaginator.first.pageIndex, length: this.matPaginator.length })
                    ),
                    this.matSort.first.sortChange.pipe(
                        startWith({ active: this.matSort.first.active, direction: this.matSort.first.direction })
                    ),
                    this.searchForm.valueChanges.pipe(
                        startWith(this.searchForm.value)
                    )
                );
            }),
        ).subscribe(([pagination, sort, filters]: [PageEvent, Sort, IPersonSearchForm]) => {
            const criteria: IPersonRequestDTO = {
                nationalities: filters.nationalities,
                genders: filters.genders,
                lastName: filters.lastName,
                sortColumn: sort.active as PersonSortColumnDTO,
                order: sort.direction
            };
            this.personFacade.loadPage({ page: pagination.pageIndex, size: pagination.pageSize }, criteria);
        });

        this.monitorAndSaveFilterPreferences();
    }

    public ngOnDestroy(): void {
        this.destroyed.next();
    }

    public delete(id: string) {
        this.personFacade.deleteByKey(id);
    }

    private setPreferredFilters(preference: IPersonFilterPreference) {
        if (preference) {
            this.searchForm.patchValue({
                genders: preference.genders,
                nationalities: preference.nationalityCodes
            });
        }
    }

    private monitorAndSaveFilterPreferences() {
        this.searchForm.valueChanges.pipe(
            takeUntil(this.destroyed)
        ).subscribe((formValue) => {
            this.preferenceService.setPreference({
                nationalityCodes: formValue.nationalities,
                genders: formValue.genders
            });
        });
    }
}
