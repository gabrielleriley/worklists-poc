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
import { CardListErrorMessageComponent, CardListFabActionSectionComponent, CardListNoItemsMessageComponent, CardTableComponent, CardTableFilterSectionComponent, CardTableLoadingIndicatorComponent, CardTablePaginationSectionComponent, CardTablePreloadIndicatorComponent, CardTableTableSectionComponent, TableListSelectionContainerComponent, TableRowCheckbox, TableRowMasterCheckbox } from './wrappers/card-list.component';


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
]
const components = [
    CardTableComponent,
    CardTableTableSectionComponent,
    CardTableFilterSectionComponent,
    CardTablePaginationSectionComponent,
    CardTableLoadingIndicatorComponent,
    CardTablePreloadIndicatorComponent,
    CardListNoItemsMessageComponent,
    CardListFabActionSectionComponent,
    CardListErrorMessageComponent
];

const directives = [
    TableListSelectionContainerComponent,
    TableRowCheckbox,
    TableRowMasterCheckbox
]

@NgModule({
    imports: [CommonModule, FlexLayoutModule, ...matModules],
    declarations: [...components, ...directives],
    exports: [...components, ...directives]
})
export class UtilitiesModule { }
