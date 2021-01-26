import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.state';

@NgModule({
    imports: [
        StoreModule.forRoot(appReducer, {
            runtimeChecks: { 
                // Auto-Entity includes classes in its actions:
                strictActionSerializability: false
            }
        }),
        EffectsModule.forRoot([]),
    ],
})
export class StateModule { }