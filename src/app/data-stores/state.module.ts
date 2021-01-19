import { NgModule } from "@angular/core";
import { ApiServicesModule } from '@app/api-services';
import { NgrxAutoEntityModule } from '@briebug/ngrx-auto-entity';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.state';
import { AutoEntityModule } from './auto-entity/auto-entity.module';

@NgModule({
    imports: [
        ApiServicesModule,
        StoreModule.forRoot(appReducer, {
            runtimeChecks: { 
                // Auto-Entity includes classes in its actions:
                strictActionSerializability: false
            }
        }),
        EffectsModule.forRoot([]),
        NgrxAutoEntityModule.forRoot(),
        AutoEntityModule
    ],
})
export class StateModule { }