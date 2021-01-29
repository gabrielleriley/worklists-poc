import { LoadableEntityAction } from "./entity-actions";
import { LoadableEntityFacade } from './entity-state-facade.interface';
import { Store } from '@ngrx/store';
import { LoadableAction } from './loadable-action.enum';
import { BehaviorSubject } from 'rxjs';

const keySelector = (entity) => entity.id;
interface ITestEntity {
    id: number;
    name: string;
}
interface ITestCriteria {
    name: string;
}
const entityStateName = 'cooper';
const loadAllActions = LoadableEntityAction.makeReadAllActions<ITestEntity, ITestCriteria>(entityStateName);
const loadPageActions = LoadableEntityAction.makeReadPagedActions<ITestEntity, ITestCriteria>(entityStateName);
const refetchAction = LoadableEntityAction.makeRefetchAllAction(entityStateName);
const patchAction = LoadableEntityAction.makePatchActions<ITestEntity>(entityStateName);
const deleteAction = LoadableEntityAction.makeDeleteActions<ITestEntity>(entityStateName);
const deleteByKeyActions = LoadableEntityAction.makeDeleteByKeyActions<number>(entityStateName);
describe('Entity Facade Builder', () => {
    interface IFacade extends LoadableEntityFacade.SelectorFacade<ITestEntity>,
        LoadableEntityFacade.LoadAllFacade,
        LoadableEntityFacade.LoadPageFacade,
        LoadableEntityFacade.RefetchFacade,
        LoadableEntityFacade.PatchFacade<ITestEntity>,
        LoadableEntityFacade.DeleteFacade<ITestEntity>,
        LoadableEntityFacade.DeleteByKeyFacade<number> { }

    const FacadeBase = new LoadableEntityFacade.EntityFacadeBuilder<ITestEntity>(keySelector)
        .addLoadAllInterface<ITestCriteria>(loadAllActions.triggerAction)
        .addLoadPageInterface<ITestCriteria>(loadPageActions.triggerAction)
        .addRefetchInterface(refetchAction)
        .addPatchInterface(patchAction.triggerAction)
        .addDeleteInterface(deleteAction.triggerAction)
        .addDeleteByKeyInterface(deleteByKeyActions.triggerAction)
        .buildFacade<IFacade>();
    const store = jasmine.createSpyObj<Store<any>>('store', ['dispatch', 'pipe']);
    const facade = new FacadeBase(store, entityStateName);
    beforeEach(() => {
        store.pipe.and.returnValue(new BehaviorSubject(undefined));
    });
    describe('addLoadAllInterface', () => {
        it('should dispatch action with criteria when provided', () => {
            facade.loadAll({ name: 'Bailey' });
            expect(store.dispatch).toHaveBeenCalledWith(loadAllActions.triggerAction({ 
                loadableActionType: LoadableAction.ReadAll,
                criteria: { name: 'Bailey' }
            }));
        });

        it('should dispatch action without criteria when not provided', () => {
            facade.loadAll();
            expect(store.dispatch).toHaveBeenCalledWith(loadAllActions.triggerAction({ 
                loadableActionType: LoadableAction.ReadAll,
                criteria: undefined,
            }));
        });
    });

    describe('addLoadPageInterface', () => {
        it('should dispatch action with criteria when provided', () => {
            facade.loadPage({ pageIndex: 1, pageSize: 12 }, { name: 'Bailey' });
            expect(store.dispatch).toHaveBeenCalledWith(loadPageActions.triggerAction({ 
                loadableActionType: LoadableAction.ReadPage,
                page: { pageIndex: 1, pageSize: 12 },
                criteria: { name: 'Bailey' }
            }));
        });

        it('should dispatch action without criteria when not provided', () => {
            facade.loadPage({ pageIndex: 1, pageSize: 12 });
            expect(store.dispatch).toHaveBeenCalledWith(loadPageActions.triggerAction({ 
                loadableActionType: LoadableAction.ReadPage,
                page: { pageIndex: 1, pageSize: 12 },
                criteria: undefined,
            }));
        });
    });

    describe('addRefetchInterface', () => {

    });

    describe('addPatchInterface', () => {

    });

    describe('addDeleteInterface', () => {

    });

    describe('addDeleteByKeyInterface', () => {

    });
});