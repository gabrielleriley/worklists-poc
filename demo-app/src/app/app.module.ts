import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { StateModule } from './data-stores/state.module';
import { UtilitiesModule } from './utils';
import { CardListInteractionDemoModule } from './pages/interaction-demo/card-list-interaction-demo.module';
import { HttpClientModule } from '@angular/common/http';
import { UsersFeatureModule } from './pages/users/users-feature.module';

const matModules = [
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
];

const demos = [
    CardListInteractionDemoModule,
    UsersFeatureModule,
]

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        StateModule,
        ...matModules,
        FlexLayoutModule,
        UtilitiesModule,
        ...demos
    ],
    providers: [
        { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: { pageSize: 12 }}
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
