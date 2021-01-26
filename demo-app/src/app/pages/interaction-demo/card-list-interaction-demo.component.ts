import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

enum State {
    Preloading = 'Preloading',
    Loading = 'Loading',
    Loaded = 'Loaded',
}

enum EntityState {
    HasPages = 'Has entities',
    Empty = 'No entities',
    LoadError = 'Entity Load Error'
}

export interface UserData {
    id: string;
    name: string;
    progress: string;
    color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
    'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
    'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
    'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
    'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];


/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
        id: id.toString(),
        name: name,
        progress: Math.round(Math.random() * 100).toString(),
        color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
}

@Component({
    selector: 'app-card-list-interaction-composed-demo',
    templateUrl: './card-list-interaction-demo-composed.component.html',
})
export class CardListInteractionDemoComponent implements AfterViewInit {
    displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
    public filterRows = [1, 2];
    dataSource: MatTableDataSource<UserData>;

    public readonly states = [State.Loaded, State.Preloading, State.Loading];
    public readonly entityStates = [EntityState.HasPages, EntityState.Empty, EntityState.LoadError];
    public currentState = State.Loading;
    public entityState = EntityState.HasPages;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor() {
        // Create 100 users
        const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }

    public get isPreloading() {
        return this.currentState === State.Preloading;
    }

    public get isLoading() {
        return this.currentState === State.Loading;
    }

    public get entities() {
        return (this.entityState === EntityState.Empty || this.entityState === EntityState.LoadError) ? [] : this.dataSource.data;
    }

    public get hasError() {
        return this.entityState === EntityState.LoadError;
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
