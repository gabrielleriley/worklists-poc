import { Injectable } from "@angular/core";
import { fetchPeople, refetchPeople } from './person-entity.actions';
import { IPersonEntity, IPersonEntityQueryCriteria, selectPersonEntityId } from './person-entity.interface';
import { Store } from '@ngrx/store';
import { PERSON_STATE_NAME } from './person-entity.state';
import { LoadableEntityFacade } from '@app/data-stores/loadable-entity';

interface IPersonFacade 
    extends LoadableEntityFacade.SelectorFacade<IPersonEntity>, 
    LoadableEntityFacade.LoadPageFacade<IPersonEntityQueryCriteria>,
    LoadableEntityFacade.RefetchPageFacade { }
const PersonFacadeBase = new LoadableEntityFacade.EntityFacadeBuilder<IPersonEntity>(selectPersonEntityId)
    .addLoadPageInterface(fetchPeople)
    .addRefetchPageInterface(refetchPeople)
    .buildFacade<IPersonFacade>();

@Injectable()
export class PersonFacade extends PersonFacadeBase {
    constructor(store: Store<any>) {
        super(store, PERSON_STATE_NAME);
    }
}


