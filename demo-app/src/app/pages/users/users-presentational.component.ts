import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import * as UsersStore from '@app/data-stores/users-v2';
import { ActionCreator, select, Store } from '@ngrx/store';

export abstract class UsersListComponent {
    constructor(
        public store: Store,
        public formBuilder: FormBuilder,
        public loadWorkflowName,
        public loadAction: ActionCreator<string, (props: UsersStore.IUserLoadProps) => any>,
    ) {
        this.formGroup.valueChanges.subscribe((val) => {
            this.store.dispatch(this.loadAction({ criteria: { genders: val.gender ? [val.gender] : [] } }));
        });
    }

    public formGroup = this.formBuilder.group({
        gender: new FormControl(undefined)
    });

    displayedColumns = ['name', 'email', 'gender'];
    isPreloading = this.store.pipe(select(UsersStore.isWorkflowPreloading(this.loadWorkflowName)));
    isLoading = this.store.pipe(select(UsersStore.isWorkflowInProgress(this.loadWorkflowName)));
    hasError = this.store.pipe(select(UsersStore.isWorkflowFailed(this.loadWorkflowName)));
    isEmpty = this.store.pipe(select(UsersStore.isEmpty));
    entities = this.store.pipe(
        select(UsersStore.usersSelector)
    );
    totalCount = this.store.pipe(select(UsersStore.totalUsersCount));
    pageIndex = this.store.pipe(select(UsersStore.usersPageIndex));
    pageSize = this.store.pipe(select(UsersStore.usersPageSize));

    goToPageIndex(pageIndex: number) {
        this.store.dispatch(this.loadAction({ pageInfo: { pageIndex } }));
    }

    performPageEvent(pageEvent: PageEvent) {
        this.store.dispatch(this.loadAction({ pageInfo: { pageIndex: pageEvent.pageIndex, pageSize: pageEvent.pageSize } }));
    }
}

@Component({
    selector: 'app-users-left-component',
    templateUrl: './users-presentational.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersLeftComponent extends UsersListComponent {
    constructor(store: Store, fb: FormBuilder) {
        super(store, fb, UsersStore.UserActionsActionWorkflowNames.GetFromLeft, UsersStore.getUsersTriggerFromLeft);
        this.store.dispatch(this.loadAction({}));
        this.store.subscribe((s) => console.log(s));
    }
    public showButton = false;
}

@Component({
    selector: 'app-users-right-component',
    templateUrl: './users-presentational.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersRightComponent extends UsersListComponent {
    constructor(store: Store, fb: FormBuilder) {
        super(store, fb, UsersStore.UserActionsActionWorkflowNames.GetFromRight, UsersStore.getUsersTriggerFromRight);
    }

    public showButton = true;
}
