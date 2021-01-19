import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { IAppState } from '../../app.state';
import { NationalityFacadeBase } from './nationality.state';
import { NationalityAutoEntity } from './nationality.model';

@Injectable({ providedIn: 'root' })
export class NationalityAutoFacade extends NationalityFacadeBase {
    constructor(store: Store<IAppState>) { 
        super(NationalityAutoEntity, store);
    }
}
