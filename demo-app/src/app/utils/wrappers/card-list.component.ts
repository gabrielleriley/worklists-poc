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
