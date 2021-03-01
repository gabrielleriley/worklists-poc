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
import { UsersLeftComponent, UsersRightComponent } from './users-presentational.component';
import { ReactiveFormsModule } from '@angular/forms';

const components = [
    UsersLeftComponent,
    UsersRightComponent
];

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
        ReactiveFormsModule
    ],
    declarations: [
        ...components
    ],
    exports: [
        ...components
    ]
})
export class UsersFeatureModule { }
