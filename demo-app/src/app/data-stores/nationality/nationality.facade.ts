import { Injectable } from "@angular/core";
import { NationalityAction } from './nationality.actions';
import { selectNationalityId, INationalityEntity } from './nationality.entity';
import { nationalityStateName } from './nationality.state';
import { Store } from '@ngrx/store';
import { LoadableEntityFacade } from '@app/data-stores/loadable-entity';


interface INationalityFacade 
    extends LoadableEntityFacade.SelectorFacade<INationalityEntity>,
    LoadableEntityFacade.LoadAllFacade,
    LoadableEntityFacade.RefetchFacade { }

const NationalityFacadeBase = new LoadableEntityFacade.EntityFacadeBuilder<INationalityEntity>(selectNationalityId)
    .addLoadAllInterface(NationalityAction.fetchAll)
    .addRefetchInterface(NationalityAction.refetch)
    .buildFacade<INationalityFacade>();

@Injectable()
export class NationalityFacade extends NationalityFacadeBase {
    constructor(store: Store<any>) {
        super(store, nationalityStateName);
    }
}
