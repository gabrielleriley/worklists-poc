import { Injectable } from "@angular/core";
import { UserAction } from './user.actions';
import { selectUserId, IUserEntity ,IUserQueryCriteria} from './user.entity';
import { userStateName } from './user.state';
import { Store } from '@ngrx/store';
import { LoadableEntityFacade } from '@app/data-stores/loadable-entity';

// TODO: Change string| number to your entity ID's type

interface IUserFacade 
    extends LoadableEntityFacade.SelectorFacade<IUserEntity, IUserQueryCriteria>,
    LoadableEntityFacade.LoadPageFacade<IUserQueryCriteria>,
    LoadableEntityFacade.RefetchFacade,
    LoadableEntityFacade.DeleteByKeyFacade<string | number> { }

const UserFacadeBase = new LoadableEntityFacade.EntityFacadeBuilder<IUserEntity>(selectUserId)
    .addLoadPageInterface(UserAction.fetchPage)
    .addRefetchInterface(UserAction.refetch)
    .addDeleteByKeyInterface(UserAction.deleteByKey)
    .buildFacade<IUserFacade>();

@Injectable()
export class UserFacade extends UserFacadeBase {
    constructor(store: Store<any>) {
        super(store, userStateName);
    }
}
