import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, first, startWith } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';

export class PersistedTableSelections {
    private currentPageIds = new BehaviorSubject([]);
    public formGroup = new FormGroup({});

    public selectedStringIds$: Observable<string[]> = this.formGroup.valueChanges.pipe(
        startWith(this.formGroup.value),
        map((fgValue) => Object.getOwnPropertyNames(fgValue).filter((key) => fgValue[key]))
    );
    public addControlsForIds(ids: (string | number)[]) {
        ids.filter((id) => !this.formGroup.contains(id.toString()))
            .forEach((id) => this.formGroup.addControl(id.toString(), new FormControl(false)));
        this.currentPageIds.next(ids);
    }
    public removeControlsForIds(ids: (string | number)[]) {
        ids.filter((id) => this.formGroup.removeControl(id.toString()));
    }

    private currentPageSelections = combineLatest(
        this.currentPageIds,
        this.formGroup.valueChanges
    ).pipe(
        map(([ids, group]) => {
            return ids.map((id) => group[id]);
        }),
        shareReplay(),
    )

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
    )

    public getRowControl(id: string | number) {
        return this.formGroup.get(id.toString());
    }

    public togglePage(change: MatCheckboxChange) {
        this.currentPageIds
            .pipe(first())
            .toPromise()
            .then((currentIds) => {
                const patch = currentIds.reduce((total, id) => ({ ...total, [id.toString()]: change.checked }), {});
                this.formGroup.patchValue(patch)
            });
    }
}