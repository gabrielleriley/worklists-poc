import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { IAppState } from '../../app.state';
import { PersonAutoEntity } from './person.model';
import { PersonFacadeBase } from './person.state';

@Injectable({ providedIn: 'root' })
export class PersonAutoEntityFacade extends PersonFacadeBase {
    constructor(store: Store<IAppState>) { 
        super(PersonAutoEntity, store);
    }
}
