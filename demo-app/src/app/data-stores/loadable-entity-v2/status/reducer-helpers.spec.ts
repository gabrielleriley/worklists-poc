import { EntityResourceMethod, IEntityStatusState } from './entity-action-timestamp.interface';
import * as Helpers from './reducer-helpers';

describe('Entity Status reducer helpers', () => {
    const baseState: IEntityStatusState = {
        inProgressActions: [
            { resourceMethodType: EntityResourceMethod.Delete, entityId: 1, timestamp: new Date(1, 1, 2021) },
        ],
        completedActions: [
            { resourceMethodType: EntityResourceMethod.Delete, entityId: 2, timestamp: new Date(1, 1, 2021) },
        ],
        failedActions: [
            { resourceMethodType: EntityResourceMethod.Delete, entityId: 3, timestamp: new Date(1, 1, 2021) },
        ]
    };
    const baseInProgressLength = baseState.inProgressActions.length;
    const baseCompletedLength = baseState.completedActions.length;
    const baseFailedLength = baseState.failedActions.length;

    const timestampDefinition = { workflowName: 'workflow', resourceMethodType: EntityResourceMethod.Update, entityId: 1 };
    const updateTimestamp = {
        workflowName: 'workflow',
        resourceMethodType: EntityResourceMethod.Update,
        entityId: 1,
        timestamp: new Date(1, 1, 2021)
    };
    describe('updateStatusesOnCancelableActionTrigger', () => {
        it('should upsert timestamp to in progress array', () => {
            // Call method twice to ensure timestamps are upserted
            const newState = Helpers.updateStatusStateOnCancelableTrigger(timestampDefinition, baseState);
            const newState2 = Helpers.updateStatusStateOnCancelableTrigger(timestampDefinition, newState);

            expect(newState.inProgressActions.length).toEqual(baseInProgressLength + 1);
            expect(newState2.inProgressActions.length).toEqual(baseInProgressLength + 1);
        });
    });

    describe('updateStatusesOnActionTrigger', () => {
        it('should add timestamp to in progress array', () => {
            // Call method twice to ensure timestamps are added
            const newState = Helpers.updateStatusStateOnTrigger(timestampDefinition, baseState);
            const newState2 = Helpers.updateStatusStateOnTrigger(timestampDefinition, newState);

            expect(newState.inProgressActions.length).toEqual(baseInProgressLength + 1);
            expect(newState2.inProgressActions.length).toEqual(baseInProgressLength + 2);
        });
    });

    describe('updateStatusesOnActionSuccess', () => {
        let newState;
        beforeEach(() => {
            const stateWithPreviousFailure = {
                ...baseState,
                inProgressActions: [updateTimestamp, ...baseState.inProgressActions],
                failedActions: [updateTimestamp, ...baseState.failedActions]
            };
            newState = Helpers.updateStatusStateOnSuccess(timestampDefinition, stateWithPreviousFailure);
        })
        it('should upsert timestamp to completed array', () => {
            // Call method a second time to ensure timestamps are upserted
            const newState2 = Helpers.updateStatusStateOnSuccess(timestampDefinition, newState);

            expect(newState.completedActions.length).toEqual(baseCompletedLength + 1);
            expect(newState2.completedActions.length).toEqual(baseCompletedLength + 1);
        });
        it('should remove correct entry from inProgress array', () => {
            expect(newState.inProgressActions.length).toEqual(baseInProgressLength);
            expect(newState.inProgressActions[0].resourceMethodType).toEqual(EntityResourceMethod.Delete);
        });
        it('should matching failure entry from failure array', () => {
            expect(newState.failedActions.length).toEqual(baseFailedLength);
            expect(newState.failedActions[0].resourceMethodType).toEqual(EntityResourceMethod.Delete);
        });
    });

    describe('updateStatusesOnActionFailure', () => {
        let newState;
        beforeEach(() => {
            const stateWithPreviousCompletion = {
                ...baseState,
                inProgressActions: [updateTimestamp, ...baseState.inProgressActions],
                completedActions: [updateTimestamp, ...baseState.completedActions]
            };
            newState = Helpers.updateStatusStateOnFailure(timestampDefinition, stateWithPreviousCompletion);
        })
        it('should upsert timestamp to failure array', () => {
            // Call method a second time to ensure timestamps are upserted
            const newState2 = Helpers.updateStatusStateOnFailure(timestampDefinition, newState);
            expect(newState.failedActions.length).toEqual(baseFailedLength + 1);
            expect(newState2.failedActions.length).toEqual(baseFailedLength + 1);
        });
        it('should remove correct entry from inProgress array', () => {
            expect(newState.inProgressActions.length).toEqual(baseInProgressLength);
            expect(newState.inProgressActions[0].resourceMethodType).toEqual(EntityResourceMethod.Delete);
        });
        it('should remove correct entry from completed array', () => {
            expect(newState.completedActions.length).toEqual(baseCompletedLength);
            expect(newState.completedActions[0].resourceMethodType).toEqual(EntityResourceMethod.Delete);
        });
    });
})