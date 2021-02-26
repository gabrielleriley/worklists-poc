import { ActionProperty, getCurrentPageInfoSelectorName, getCriteriaSelectorName, getActionCallLines } from "@shared/ngrx-helpers";
import { line, convertLines } from "@shared/formatters";

export interface IEffectDefinition {
    effectName: string;
    entityName: string;
    serviceCallName: string;
    triggerActionName: string;
    successActionName: string;
    failureActionName: string;
    triggerProperties: ActionProperty[];
    successProperties: ActionProperty[];
    failureProperties: ActionProperty[];
}

function getWithLatestFrom(entityName: string, props: ActionProperty[]) {
    const getSelector = (prop: ActionProperty) => {
        switch (prop) {
            case ActionProperty.PageInfo:
                return `this.store.pipe(select(${getCurrentPageInfoSelectorName(entityName)}))`;
            case ActionProperty.EntityCriteria:
                return `this.store.pipe(select(${getCriteriaSelectorName(entityName)}))`;
            default:
                return '';
        }
    }
    const selectors = props
        .map((p) => getSelector(p))
        .filter(p => p !== '');
    if (selectors.length === 0) {
        return [];
    } else {
        return [
            line(`withLatestFrom(`, 2),
            ...selectors.map((l) => line(l, 3)),
            line(`),`, 2)
        ];
    }
}

function createMapArguments(properties: ActionProperty[]) {
    const getArg = (prop: ActionProperty) => {
        switch (prop) {
            case ActionProperty.PageInfo:
                return `pageInfo`;
            case ActionProperty.EntityCriteria:
                return `criteria`;
            default:
                return '';
        }
    }
    const args = [
        '_action',
        properties.map((p) => getArg(p)).filter(p => p !== '')
    ];
    return args.length > 1 ? `[${args.join(', ')}]` : args[0];
}

function createServiceArgs(properties: ActionProperty[]) {
    const getArgName = (prop: ActionProperty) => {
        switch (prop) {
            case ActionProperty.SingleEntityId:
                return '_action.id';
            case ActionProperty.EntityIdList:
                return `_action.ids`;
            case ActionProperty.SingleEntity:
                return '_action.entity';
            case ActionProperty.PageInfo:
                return 'pageInfo';
            case ActionProperty.EntityCriteria:
                return 'criteria';
        }
    };
    const propertyOrder = [
        ActionProperty.SingleEntityId,
        ActionProperty.EntityIdList,
        ActionProperty.SingleEntity,
        ActionProperty.PageInfo,
        ActionProperty.EntityCriteria
    ].filter(p => properties.includes(p)).map(p => getArgName(p));
    return propertyOrder.join(', ');
}
function createServiceRxjsMap(def: IEffectDefinition) {
    const getArg = (p: ActionProperty) => {
        switch (p) {
            case ActionProperty.EntityCriteria:
            case ActionProperty.EntityIdList:
            case ActionProperty.EntityList:
            case ActionProperty.SingleEntity:
            case ActionProperty.SingleEntityId:
                return 'payload.data';
            case ActionProperty.TotalCount:
                return 'payload.totalCount';
            default:
                return '';
        }
    }
    const baseIndent = 4;
    const lines = [
        line(`map((payload) => {)`, baseIndent),
        line(`if(payload.errorMessage) {`, baseIndent + 1),
        ...getActionCallLines(
            `Actions.${def.failureActionName}`,
            baseIndent + 2,
            true
        ),
        line(`}`, baseIndent + 1),
        line(`else {`, baseIndent + 1),
        ...getActionCallLines(
            `Actions.${def.successActionName}`,
            baseIndent + 2,
            true,
            def.successProperties.map((p) => ({ key: p, value: getArg(p) }))
        ),
        line(`}`, baseIndent + 1),
        line(`})`, baseIndent)
    ];
    return lines;
}

function createServiceCall(def: IEffectDefinition) {
    return [
        line(`this.entityService.${def.serviceCallName}(${createServiceArgs(def.triggerProperties)}).pipe(`, 3),
        ...createServiceRxjsMap(def),
        line(`catchError(() => of(Actions.${def.failureActionName})())`),
        line(`);`, 3)
    ]
}
export function createSwitchedEffect(def: IEffectDefinition) {
    const lines = [
        line(`public ${def.effectName} = createEffect(() => this.actions.pipe(`, 1),
        line(`ofType(${def.triggerActionName})`, 2),
        ...getWithLatestFrom(def.entityName, def.triggerProperties),
        line(`switchMap((${createMapArguments(def.triggerProperties)}) => {`, 2),
        ...createServiceCall(def),
        line(`})`, 2),
        line(`));`, 1)
    ];
    return convertLines(lines);
}

export function createMergeEffect(def: IEffectDefinition) {
    const lines = [
        line(`public ${def.effectName} = createEffect(() => this.actions.pipe(`, 1),
        line(`ofType(${def.triggerActionName})`, 2),
        ...getWithLatestFrom(def.entityName, def.triggerProperties),
        line(`mergeMap((${createMapArguments(def.triggerProperties)}) => {`, 2),
        ...createServiceCall(def),
        line(`})`, 2),
        line(`));`, 1)
    ];
    return convertLines(lines);
}

export function createDispatchEffect(effectName: string, triggerActions: string[], dispatchAction: string) {
    const lines = [
        line(`public ${effectName} = createEffect(() => this.actions.pipe(`, 1),
        line(`ofType(`, 2),
        line(`// TODO: Add any action types that should dispatch the final action to the ofType operator`, 3),
        ...triggerActions.map((ta) => line(`${ta},`, 3)),
        line(`),`, 2),
        line(`mapTo(${dispatchAction}())`, 2),
        line(`));`, 1)
    ];
    return convertLines(lines);
}
