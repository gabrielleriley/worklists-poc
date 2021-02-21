import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CardListErrorMessageComponent, CardListFabActionSectionDirective, CardListNoItemsMessageComponent, CardTableComponent, CardTableFilterSectionComponent, CardTableLoadingIndicatorComponent, CardTablePreloadIndicatorComponent, CardTableTableSectionComponent, CardTablePageJumper } from './wrappers/card-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';


const matModules = [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
];

const components = [
    CardTableComponent,
    CardTableTableSectionComponent,
    CardTableFilterSectionComponent,
    CardTableLoadingIndicatorComponent,
    CardTablePreloadIndicatorComponent,
    CardListNoItemsMessageComponent,
    CardListFabActionSectionDirective,
    CardListErrorMessageComponent,
    CardTablePageJumper,
];


@NgModule({
    imports: [CommonModule, FlexLayoutModule, ReactiveFormsModule, ...matModules],
    declarations: [...components],
    exports: [...components]
})
export class UtilitiesModule { }
