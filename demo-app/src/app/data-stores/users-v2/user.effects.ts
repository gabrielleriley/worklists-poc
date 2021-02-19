import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UserEntityService } from './user-entity.service';
import * as UserActions from './user.actions';
import { of } from 'rxjs';
import { getUsersFailureFromRight } from './user.actions';

@Injectable()
export class UserEntityEffects {
    constructor(private userEntityService: UserEntityService, private actions: Actions) { }

    public loadUsersFromLeft = createEffect(() => this.actions.pipe(
        ofType(UserActions.getUsersTriggerFromLeft),
        switchMap((action) => {
            return this.userEntityService.loadPage({ pageIndex: 1, pageSize: 12 }, undefined).pipe(
                map(() => UserActions.getUsersSuccessFromLeft()),
                catchError(() => of(UserActions.getUsersFailureFromLeft()))
            );
        })
    ));

    public loadUsersFromRight = createEffect(() => this.actions.pipe(
        ofType(UserActions.getUsersTriggerFromRight),
        switchMap((action) => {
            return this.userEntityService.loadPage({ pageIndex: 1, pageSize: 12 }, undefined).pipe(
                map(() => UserActions.getUsersSuccessFromRight()),
                catchError(() => of(UserActions.getUsersFailureFromRight()))
            );
        })
    ));
}
