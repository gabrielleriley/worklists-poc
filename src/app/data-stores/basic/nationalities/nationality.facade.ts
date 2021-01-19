import { Injectable } from '@angular/core';
import { LoadableEntityFacade } from '@app/data-stores/loadable-entity';
import { Store } from '@ngrx/store';
import { fetchNationalities } from './nationality.actions';
import { INationalityEntity } from './nationality.interface';
import { NATIONALITY_STATE_NAME, selectNationalityId } from './nationality.state';

interface INationalityFacade extends LoadableEntityFacade.SelectorFacade<INationalityEntity>, LoadableEntityFacade.LoadAllFacade { }
const NationalityFacadeBase = new LoadableEntityFacade.EntityFacadeBuilder<INationalityEntity>(selectNationalityId)
    .addLoadAllInterface(fetchNationalities)
    .buildFacade<INationalityFacade>();

@Injectable()
export class NationalityFacade extends NationalityFacadeBase implements INationalityFacade { 
    constructor(store: Store<any>) {
        super(store, NATIONALITY_STATE_NAME);
    }
}