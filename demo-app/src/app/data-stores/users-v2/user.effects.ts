import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { UserEntityService } from './user-entity.service';
import * as UserActions from './user.actions';
import * as Selectors from './user.selectors';
import { Store, select } from '@ngrx/store';

@Injectable()
export class UserEntityEffects {
    constructor(
        private store: Store,
        private userEntityService: UserEntityService,
        private actions: Actions
    ) {
        this.actions.subscribe((a) => console.log(a));
    }

    public loadUsersFromLeft = createEffect(() => this.actions.pipe(
        ofType(UserActions.getUsersTriggerFromLeft),
        withLatestFrom(this.store.pipe(select(Selectors.usersPageInfo)), this.store.pipe(select(Selectors.usersCriteria))),
        switchMap(([action, pageInfo, criteria]) => {
            return this.userEntityService.loadPage(pageInfo, criteria).pipe(
                map((res) => {
                    if (res.errorMessage) {
                        return UserActions.getUsersFailureFromLeft();
                    } else {
                        return UserActions.getUsersSuccessFromLeft({
                            totalCount: res.totalCount,
                            entities: res.entities
                        });
                    }
                }),
                catchError(() => of(UserActions.getUsersFailureFromLeft()))
            );
        })
    ));

    public loadUsersFromRight = createEffect(() => this.actions.pipe(
        ofType(UserActions.getUsersTriggerFromRight),
        withLatestFrom(this.store.pipe(select(Selectors.usersPageInfo)), this.store.pipe(select(Selectors.usersCriteria))),
        switchMap(([action, pageInfo, criteria]) => {
            return this.userEntityService.loadPage(pageInfo, criteria).pipe(
                map((res) => UserActions.getUsersSuccessFromRight({ totalCount: res.totalCount, entities: res.entities })),
                catchError(() => of(UserActions.getUsersFailureFromRight()))
            );
        })
    ));
}
