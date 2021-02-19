import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserEntityService } from './user-entity.service';
import { UserEntityEffects } from './user.effects';
import { userReducer } from './user.reducer';
import { userStateName } from './user.state';

@NgModule({
    imports: [
        StoreModule.forFeature(userStateName, userReducer),
        EffectsModule.forFeature([UserEntityEffects]),
        MatSnackBarModule
    ],
    providers: [
        UserEntityService,
    ]
})
export class UserEntityStateModule { }
