import { Injectable, Inject } from "@angular/core";
import { createEffectsHelperToken, EntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { IUserEntity } from './user.entity';
import { userStateName } from './user.state';
import { UserAction } from './user.actions';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createAction } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { dispatch } from "rxjs/internal/observable/pairs";
import {MatSnackBar} from '@angular/material/snack-bar';

export const userEffectsHelperToken = createEffectsHelperToken(userStateName);

@Injectable()
export class UserEntityEffects {
    constructor(
        @Inject(userEffectsHelperToken) 
        private helper: EntityEffectsHelper<IUserEntity>,
        private actions: Actions,
        private snackBar: MatSnackBar
    ) { }
    
    public load$ = this.helper.createEntityLoadPageEffect({
        triggerAction: UserAction.fetchPage,
        successAction: UserAction.fetchPageSuccess,
        errorAction: UserAction.fetchPageError
    });

    public deleteByKey$ = this.helper.createEntityDeleteByKeyEffect({
        triggerAction: UserAction.deleteByKey,
        successAction: UserAction.deleteByKeySuccess,
        errorAction: UserAction.deleteByKeyError
    });
    
    public refetch$ = this.helper.createRefetchPageEffect([
        UserAction.deleteByKeySuccess,
        UserAction.refetch
    ], UserAction.fetchPage);

    public showLoadErrorToast$ = createEffect(() =>
        this.actions.pipe(
            ofType(UserAction.fetchPageError),
            tap((error) => this.snackBar.open('Load error')) //come back and play with the error specifics to display
        ),
        { dispatch: false }
    )

    
    public showDeleteErrorToast$ = createEffect(() =>
        this.actions.pipe(
            ofType(UserAction.deleteByKeyError),
            tap((error) => this.snackBar.open('Delete user error', 'Delete User Error')) //come back and play with the error specifics to display
        ),
        { dispatch: false }
    )

}