import { ILineIndent } from '../../../shared/formatters';
import { ResourceMethodEnumEntry } from '../../../shared/ngrx-helpers';
import { getReducerName, getStateName, line } from '../../functions';
import { convertLines } from '../../../shared/formatters/indentation-helpers';

export enum ReducerTestType {
    StatusTimestamps,
}

export interface IReducerWorkflowTestConfig {
    entityName: string;
    actionPrefix: string;
    resourceType: ResourceMethodEnumEntry;
    testTypes: ReducerTestType[];
}

function createBasicItFn(name: string, testStatements: string[], baseIndent: number): ILineIndent[] {
    return [
        line(`it('${name}', () => {`, baseIndent),
        ...testStatements.map(ts => line(ts, baseIndent + 1)),
        line(`});`, baseIndent)
    ];
}


function createTriggerTests(config: IReducerWorkflowTestConfig, baseIndent: number) {
    const setup = [
        line(`const triggerAction = EntityAction.${config.actionPrefix}Trigger();`, baseIndent + 1),
        line(`let newState: ${getStateName(config.entityName)};`, baseIndent + 1),
        line(`beforeAll(() => {`, baseIndent + 1),
        line(`newState = EntityReducer.${getReducerName(config.entityName)}(newState, triggerAction);`, baseIndent + 2),
        line(`});`, baseIndent + 1)
    ];

    const inProgressActionsTest = createBasicItFn(
        'should add timestamp to inProgressActions',
        ['expect(newState.inProgressActions.length).toEqual(initialState.inProgressActions.length + 1);'],
        baseIndent + 1
    );

    return [
        line(`describe('${config.actionPrefix}Trigger', () => {`, baseIndent),
        ...setup,
        ...inProgressActionsTest,
        line(`});`, baseIndent),
    ];
}

function createSuccessTests(config: IReducerWorkflowTestConfig, baseIndent: number) {
    const setup = [
        line(`const successAction = EntityAction.${config.actionPrefix}Success();`, baseIndent + 1),
        line(`let newState: ${getStateName(config.entityName)};`, baseIndent + 1),
        line(`beforeAll(() => {`, baseIndent + 1),
        line(`newState = {`, baseIndent + 2),
        line(`...initialState,`, baseIndent + 3),
        line(`inProgressActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.${config.resourceType}, timestamp: new Date(2000, 1, 1)}],`, baseIndent + 3),
        line(`completedActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.${config.resourceType}, timestamp: new Date(2000, 1, 1)}],`, baseIndent + 3),
        line(`};`, baseIndent + 2),
        line(`newState = EntityReducer.${getReducerName(config.entityName)}(newState, successAction);`, baseIndent + 2),
        line(`});`, baseIndent + 1)
    ];

    const inProgressActionsTest = createBasicItFn(
        'should remove timestamp from inProgressActions',
        ['expect(newState.inProgressActions.length).toEqual(initialState.inProgressActions.length);'],
        baseIndent + 1
    );

    const addFailureTimestampTest = createBasicItFn(
        'should add timestamp to completedActions',
        [
            'expect(newState.completedActions.length).toEqual(initialState.completedActions.length + 1);',
            `expect(newState.completedActions.reverse()[0].resourceMethodType).toEqual(EntityStatus.EntityResourceMethod.${config.resourceType});`
        ],
        baseIndent + 1
    );

    const removeCompletedTimestampTest = createBasicItFn(
        'should remove previous failure from failedActions',
        ['expect(newState.failedActions.length).toEqual(initialState.failedActions.length);'],
        baseIndent + 1
    );

    return [
        line(`describe('${config.actionPrefix}Success', () => {`, baseIndent),
        ...setup,
        ...inProgressActionsTest,
        ...addFailureTimestampTest,
        ...removeCompletedTimestampTest,
        line(`});`, baseIndent),
    ];
}

function createFailureTests(config: IReducerWorkflowTestConfig, baseIndent: number) {
    const setup = [
        line(`const failureAction = EntityAction.${config.actionPrefix}Failure();`, baseIndent + 1),
        line(`let newState: ${getStateName(config.entityName)};`, baseIndent + 1),
        line(`beforeAll(() => {`, baseIndent + 1),
        line(`newState = {`, baseIndent + 2),
        line(`...initialState,`, baseIndent + 3),
        line(`inProgressActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.${config.resourceType}, timestamp: new Date(2000, 1, 1)}],`, baseIndent + 3),
        line(`completedActions: [{ resourceMethodType: EntityStatus.EntityResourceMethod.${config.resourceType}, timestamp: new Date(2000, 1, 1)}],`, baseIndent + 3),
        line(`};`, baseIndent + 2),
        line(`newState = EntityReducer.${getReducerName(config.entityName)}(newState, failureAction);`, baseIndent + 2),
        line(`});`, baseIndent + 1)
    ];

    const inProgressActionsTest = createBasicItFn(
        'should remove timestamp from inProgressActions',
        ['expect(newState.inProgressActions.length).toEqual(initialState.inProgressActions.length);'],
        baseIndent + 1
    );

    const addFailureTimestampTest = createBasicItFn(
        'should add timestamp to failedActions',
        [
            'expect(newState.failedActions.length).toEqual(initialState.failedActions.length + 1);',
            `expect(newState.failedActions.reverse()[0].resourceMethodType).toEqual(EntityStatus.EntityResourceMethod.${config.resourceType});`
        ],
        baseIndent + 1
    );

    const removeCompletedTimestampTest = createBasicItFn(
        'should remove previous completion from completedActions',
        ['expect(newState.completedActions.length).toEqual(initialState.completedActions.length);'],
        baseIndent + 1
    );

    return [
        line(`describe('${config.actionPrefix}Failure', () => {`, baseIndent),
        ...setup,
        ...inProgressActionsTest,
        ...addFailureTimestampTest,
        ...removeCompletedTimestampTest,
        line(`});`, baseIndent),
    ];
}

export function createReducerWorkflowTests(config: IReducerWorkflowTestConfig) {
    const lines = [
        line(`// TODO: Setup mock data for trigger/success/failure action props as needed`, 1),
        line(`describe('${config.actionPrefix} - Action Workflow', () => {`, 1),
        ...createTriggerTests(config, 2),
        ...createSuccessTests(config, 2),
        ...createFailureTests(config, 2),
        line(`});`, 1)
    ];

    return convertLines(lines);
}