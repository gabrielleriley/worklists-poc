import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';

/**
 * Maintains table selections across multiple pages
 */
export class PersistedTableSelections {
    private currentPageIds = new BehaviorSubject([]);
    public formGroup = new FormGroup({});

    private currentPageSelections = combineLatest([
        this.currentPageIds,
        this.formGroup.valueChanges
    ]).pipe(
        map(([ids, group]) => {
            return ids.map((id) => group[id]);
        }),
        shareReplay(),
    );

    public indeterminate: Observable<boolean> = this.currentPageSelections.pipe(
        map((currentPageSelections) => {
            let someChecked = false;
            let allChecked = true;
            currentPageSelections.forEach((s) => {
                if (s) {
                    someChecked = true;
                } else {
                    allChecked = false;
                }
            });
            return someChecked && !allChecked;
        })
    );

    public allChecked: Observable<boolean> = this.currentPageSelections.pipe(
        map((currentPageSelections) => currentPageSelections.every((s) => s))
    );

    public selectedStringIds$: Observable<string[]> = this.formGroup.valueChanges.pipe(
        startWith(this.formGroup.value),
        map((fgValue) => Object.getOwnPropertyNames(fgValue).filter((key) => fgValue[key]))
    );

    /**
     * Adds form controls for row IDs
     * @param ids Array of row IDs
     */
    public addControlsForIdsOnPage(ids: (string | number)[]) {
        ids.filter((id) => !this.formGroup.contains(id.toString()))
            .forEach((id) => this.formGroup.addControl(id.toString(), new FormControl(false)));
    }

    /**
     * Sets the current page IDs, which is used to determine header checkbox status
     * @param ids Array of row IDs present on current page
     */
    public setCurrentPageIds(ids: (string | number)[]) {
        this.currentPageIds.next(ids);
    }

    /**
     * Removes row ID controls from form group.
     * @param ids Array of row IDs to be removed
     */
    public removeControlsForIds(ids: (string | number)[]) {
        ids.filter((id) => this.formGroup.removeControl(id.toString()));
    }

    public getRowControl(id: string | number) {
        return this.formGroup.get(id.toString());
    }

    public togglePage(change: MatCheckboxChange) {
        this.currentPageIds
            .pipe(take(1))
            .toPromise()
            .then((currentIds) => {
                const patch = currentIds.reduce((total, id) => ({ ...total, [id.toString()]: change.checked }), {});
                this.formGroup.patchValue(patch);
            });
    }
}
