import { ChangeDetectionStrategy, Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, Directive } from "@angular/core";
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { KeyValue } from '@angular/common';

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

@Directive({
    selector: `[appTableFabActionSection]`
})
export class CardListFabActionSectionDirective { }

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

@Component({
    selector: 'app-page-jumper',
    template: `
    <span class="mat-paginator-page-size-label">Page: </span>
    <mat-form-field>
        <mat-select [formControl]="pageSelectionFC">          
            <mat-option *ngFor="let o of options" [value]="o.key">{{o.value}}</mat-option>
        </mat-select>
    </mat-form-field>
    `,
    styleUrls: ['./loading-shade.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTablePageJumper implements OnInit, OnDestroy, OnChanges {
    @Input() pageSize = 0;
    @Input() totalCount = 0;
    @Input() pageIndex = 0;
    @Output() pageSelect = new EventEmitter();
    pageSelectionFC = new FormControl(0);
    options = [];

    private destroyed$ = new Subject<void>();

    ngOnInit(): void {
        this.pageSelectionFC.valueChanges.pipe(
            takeUntil(this.destroyed$),
        ).subscribe((pageIndex) => {
            this.pageSelect.emit(pageIndex);
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
    }

    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        if (changes['pageSize'] || changes['totalCount']) {
            this.options = this.setOptions(this.totalCount, this.pageSize);
        } else {
            this.pageSelectionFC.setValue(changes['pageIndex'].currentValue, { emitEvent: false });
        }
    }

    private setOptions(itemCount: number, pageSize: number): KeyValue<number, string>[] {
        const pageOptions = [];
        if (pageSize === 0 || itemCount === 0) {
            return pageOptions;
        }

        const totalPages = itemCount / pageSize;
        const remainder = itemCount % pageSize;
        let startingItemCount = 1;
        for (let i = 0; i <= totalPages; i++) {
            if (remainder === 0 && i === totalPages) {
                continue;
            }
            const shownPage = i + 1;
            const endingItemCount = shownPage * pageSize;
            const pageOptionText = `${shownPage.toString()} (${startingItemCount} - ${endingItemCount})`;
            pageOptions.push({ key: i, value: pageOptionText});
            startingItemCount = endingItemCount + 1;
        }
        return pageOptions;
    }
}