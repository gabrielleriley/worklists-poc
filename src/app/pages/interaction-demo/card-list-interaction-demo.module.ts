import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UtilitiesModule } from '@app/utils';
import { CardListInteractionDemoComponent } from './card-list-interaction-demo.component';

@NgModule({
    imports: [
        CommonModule,
        UtilitiesModule,
        MatSelectModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
    ],
    declarations: [
        CardListInteractionDemoComponent
    ],
    exports: [
        CardListInteractionDemoComponent
    ]
})
export class CardListInteractionDemoModule { }
