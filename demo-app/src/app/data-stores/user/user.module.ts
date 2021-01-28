import { NgModule, InjectionToken } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { userStateName } from './user.state';
import { userReducer } from './user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEntityEffects, userEffectsHelperToken } from './user.effects';
import { provideEntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { UserEntityService } from './user-entity.service';
import { UserFacade } from './user.facade';
import { selectUserId } from './user.entity';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const entity = new InjectionToken('Person');
@NgModule({
    imports: [
        StoreModule.forFeature(userStateName, userReducer),
        EffectsModule.forFeature([UserEntityEffects]),
        MatSnackBarModule
    ],
    providers: [
        UserEntityService,
        { provide: entity, useExisting: UserEntityService },
        provideEntityEffectsHelper(userStateName, selectUserId, userEffectsHelperToken, entity),
        UserFacade
    ]
})
export class UserEntityStateModule { }