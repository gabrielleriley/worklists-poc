import * as EntityStatus from '<%= dasherize(statusLibraryPath) %>';
import * as EntityAction from './<%= dasherize(name) %>.actions';
import * as EntityReducer from './<%= dasherize(name) %>.reducer';
import { I<%= capitalize(name) %>EntityState } from './<%= dasherize(name) %>.state';

const initialState: I<%= capitalize(name) %>EntityState = {
    ids: [],
    entities: { },
    completedActions: [],
    inProgressActions: [],
    failedActions: [],
    <% if(paginated) { %>totalCount: 0,
    pageInfo: { pageIndex: 0, pageSize: 12 },<%}%>
    <% if(queryParams) {%>criteria: undefined,<%}%>
};
describe('Test Reducer', () => {
    describe('clear action', () => {
        it('should revert status actions to initial state', () => {
            const state: I<%= capitalize(name) %>EntityState = {
                ...initialState,
                completedActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.Read, timestamp: new Date() }],
                inProgressActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.Create, timestamp: new Date() }],
                failedActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.Update, timestamp: new Date() }]
            };

            const newState = EntityReducer.<%= camelize(name) %>Reducer(state, EntityAction.clear<%= capitalize(name) %>Store);
            expect(newState.inProgressActions.length).toEqual(0);
            expect(newState.completedActions.length).toEqual(0);
            expect(newState.failedActions.length).toEqual(0);
        });

        <% if(paginated) { %>it('should revert page info to initial state', () => {
            const state: I<%= capitalize(name) %>EntityState = {
                ...initialState,
                pageInfo: { pageIndex: 10, pageSize: 100 }
            };
            const newState = EntityReducer.<%= camelize(name) %>Reducer(state, EntityAction.clear<%= capitalize(name) %>Store);
            expect(newState.pageInfo).toEqual({ pageIndex: 0, pageSize: 12 });
        });<%}%>

        <% if(queryParams) {%>it('should criteria to undefined', () => {
            const state: I<%= capitalize(name) %>EntityState = {
                ...initialState,
                criteria: { }
            };
            const newState = EntityReducer.<%= camelize(name) %>Reducer(state, EntityAction.clear<%= capitalize(name) %>Store);
            expect(newState.criteria).toBeUndefined();
        });<%}%>
    });
});
