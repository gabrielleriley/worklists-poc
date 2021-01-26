import { Component, Input, ChangeDetectionStrategy, Directive, ContentChildren, AfterContentInit, QueryList, ElementRef, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatSelect } from '@angular/material/select';
import { MatCheckbox, TransitionCheckState } from '@angular/material/checkbox';
import { FormControl, ControlValueAccessor, FormArray } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';

@Component({
    selector: 'app-card-list-preloading-indicator',
    template: `
    <div>
        <mat-spinner></mat-spinner>
    </div>`,
    styleUrls: ['./loading-shade.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTablePreloadIndicatorComponent { }

@Component({
    selector: 'app-card-list-loading-indicator',
    template: `
    <div class="card-table--spinner">
        <mat-spinner></mat-spinner>
    </div>`,
    styleUrls: ['./loading-shade.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTableLoadingIndicatorComponent { }

@Component({
    selector: 'app-card-list-fab-action-section',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListFabActionSectionComponent { }

@Component({
    selector: 'app-card-list-filters-section',
    template: `<span fxLayout="row wrap" fxLayoutGap="1rem"><ng-content></ng-content></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTableFilterSectionComponent { }

@Component({
    selector: 'app-card-list-table-section',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTableTableSectionComponent { }

const cardMessageComponentTemplate = `<div class="card-table--centered-message">
<div fxLayout="row" fxLayoutAlign="center"><ng-content></ng-content></div>
<div class="card-table--button"><ng-content select="button"></ng-content></div>
</div>`

@Component({
    selector: 'app-card-list-empty-message',
    template: cardMessageComponentTemplate,
    styleUrls: ['./loading-shade.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListNoItemsMessageComponent { }

@Component({
    selector: 'app-card-list-error-message',
    template: cardMessageComponentTemplate,
    styleUrls: ['./loading-shade.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListErrorMessageComponent { }

@Component({
    selector: 'app-card-list-paginator-section',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTablePaginationSectionComponent { }

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./loading-shade.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTableComponent {
    @Input() isPreloading: boolean;
    @Input() isLoading: boolean;
    @Input() hasError: boolean;
    @Input() isEmpty: boolean;

    public get ignoreInterface() {
        return [this.isPreloading, this.hasError, this.isEmpty].every((val) => val === undefined);
    }
}

@Directive({
    selector: '[appTableCheckboxId]'
})
export class TableRowCheckbox implements OnInit, OnDestroy {
    constructor(private checkbox: MatCheckbox, private parent: TableListSelectionContainerComponent) { }

    private destroyed$ = new Subject();
    @Input('appTableCheckboxId') public checkboxId: string | number;

    public get checked() {
        return this.checkbox.checked;
    }
    ngOnInit() {
        this.checkbox.writeValue(this.parent.getDefaultValue(this.checkboxId));
        this.checkbox.change.pipe(
            takeUntil(this.destroyed$),
        ).subscribe((change) => {
            this.parent.setIsChecked(this.checkboxId, change.checked);
        });
    }

    ngOnDestroy() {
        this.parent.deregister(this.checkboxId);
        this.destroyed$.next();
    }
}

@Directive({
    selector: '[appTableMainCheckbox]'
})
export class TableRowMasterCheckbox implements OnInit {
    constructor(
        private checkbox: MatCheckbox,
        private parent: TableListSelectionContainerComponent,
        private cdr: ChangeDetectorRef
    ) { }
    ngOnInit(): void {
        this.parent.registerMainCheckbox(this);
    }

    public setIndeterminate() {
        if (!this.checkbox.indeterminate) {
            console.log('INDETERMINATE');
            this.checkbox.checked = true;
            this.checkbox.indeterminate = true;
        }
    }

    public setChecked(s: boolean) {
        if (s !== this.checkbox.checked || this.checkbox.indeterminate) {
            console.log('SET MAIN CHECKED: ' + s);
            if (s) {
                this.checkbox.indeterminate = false;
            }
            this.checkbox.checked = s;

            if (!s) {
                this.checkbox.indeterminate = false;
            }
        }
    }
}

@Directive({
    selector: '[appTableSelectable]',
})
export class TableListSelectionContainerComponent implements OnInit {
    constructor(private cdr: ChangeDetectorRef) { }
    @ContentChildren(TableRowCheckbox, { descendants: true }) public checks: QueryList<TableRowCheckbox>;
    //@Input() public formArray: FormArray;
    @Input() public formControl: FormControl = new FormControl([]);
    @Input() public numberOfRows: number;

    private registeredIds = [];
    private statuses = {};
    private mainCheckbox: TableRowMasterCheckbox;
    ngOnInit(): void {

    }
    getDefaultValue(id: string | number) {
        const selected = this.formControl.value.some((v) => v === id);
        this.statuses = { ...this.statuses, ...{ [id]: selected } };
        //this.formArray.push(new FormControl(selected));
        this.registeredIds.push(id);
        this.setPageSelectionStatus();        
        this.cdr.detectChanges();
        return selected;
    }

    deregister(id: string | number) {
        this.registeredIds = this.registeredIds.filter((rId) => rId !== id);
        this.setPageSelectionStatus();
    }

    registerMainCheckbox(checkbox: TableRowMasterCheckbox) {
        this.mainCheckbox = checkbox;
    }

    setIsChecked(id: string | number, checked: boolean) {
        if (checked) {
            this.formControl.setValue([...this.formControl.value, id]);
        } else {
            this.formControl.setValue([...this.formControl.value.filter((v) => v === id)]);
        }
        this.statuses = { ...this.statuses, ...{ [id]: checked } }
        this.setPageSelectionStatus();
    }

    setPageSelectionStatus() {
        let someSelected = false;
        const allSelected = this.registeredIds.every((id) => {
            const selected = this.statuses[id];
            if (selected) {
                someSelected = true;
            }
            return selected === true;
        });
        if (someSelected) {
            if (allSelected) {
                this.mainCheckbox.setChecked(true);
            } else {
                this.mainCheckbox.setIndeterminate();
            }
        } else {
            this.mainCheckbox.setChecked(false);
        }
    }
}

