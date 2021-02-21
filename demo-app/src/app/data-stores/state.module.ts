import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.state';
import { UserEntityStateModule } from './users-v2';

@NgModule({
    imports: [
        StoreModule.forRoot(appReducer, {
            runtimeChecks: { 
                // Auto-Entity includes classes in its actions:
                strictActionSerializability: false
            }
        }),
        EffectsModule.forRoot([]),
        UserEntityStateModule
    ],
})
export class StateModule { }