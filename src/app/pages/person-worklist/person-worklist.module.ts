import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UtilitiesModule } from '@app/utils';
import { PersonEntityWorklistDemoComponent } from './loadable-entity-demo/person-entity-worklist.component';
import { PersonEntityStateModule } from '@app/data-stores/basic/people/person-entity.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NationalityEntityModule } from '@app/data-stores/basic/nationalities/nationality.module';

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
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        UtilitiesModule,
        PersonEntityStateModule,
        NationalityEntityModule,
        ...matModules
    ],
    declarations: [
        PersonEntityWorklistDemoComponent
    ],
    exports: [
        PersonEntityWorklistDemoComponent
    ]
})
export class PersonWorklistModule { }

