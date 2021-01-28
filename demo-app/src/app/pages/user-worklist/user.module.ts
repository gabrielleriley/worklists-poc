import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilitiesModule } from '@app/utils';
import { UserTableComponent } from './user-table.component';

// Import any Angular Material components needed for your feature
// https://material.angular.io/components
const matModules = [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UtilitiesModule,
        ...matModules,
        // TODO: Add any necessary state modules
    ],
    declarations: [
        UserTableComponent
    ],
    exports: [
        UserTableComponent
    ]
})
export class UserFeatureModule { }