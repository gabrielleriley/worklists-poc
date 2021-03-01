import * as Helpers from '../../functions';
import { IActionWorkflowSchema, ApiProperties, ApiResponseType } from '../interfaces';
import { hasCriteria, isPaged, isRead, needsPageInfo } from './schema-helpers';

function getEffectName(options: IActionWorkflowSchema) {
    return `${options.actionPrefix}Effect`;
}

function doWithLatestFrom(props: ApiProperties) {
    switch (props) {
        case ApiProperties.Paged:
        case ApiProperties.PagedAndCriteria:
        case ApiProperties.Criteria:
            return true;
        default:
            return false;
    }
}

function getEntityServiceArguments(options: IActionWorkflowSchema) {
    switch (options.apiProperties) {
        case ApiProperties.Criteria:
            return `criteria`;
        case ApiProperties.PagedAndCriteria:
            return `pageInfo, criteria`
        case ApiProperties.Paged:
            return `pageInfo`;
        case ApiProperties.None:
            return '';
        default:
            return `/* TODO: Replace me the appropriate arguments */undefined`;
    }
}

function getPayloadResponseType(options: IActionWorkflowSchema) {
    switch(options.apiResponse) {
        case ApiResponseType.EntityList:
            if (isPaged(options)) {
                return `: EntityPage.IPagedEntityPayload<${Helpers.getEntityInterfaceName(options.name)}[]>`
            } else {
                return `: EntityStatus.IEntityPayload<${Helpers.getEntityInterfaceName(options.name)}[]>`
            }
        default:
            return ': EntityStatus.IEntityPayload</*TODO: Define the response type*/any>';
    }
}

function getSuccessProps(options: IActionWorkflowSchema) {
    switch(options.apiResponse) {
        case ApiResponseType.EntityList:
            let properties: string[];
            if (needsPageInfo(options)) {
                properties = [`entities: payload.data`, `totalCount: payload.totalCount`];
            } else {
                properties = [`entities: payload.data`]
            }
            return `{ ${properties.join(', ')} }`;
        case ApiResponseType.Nothing:
            return '';
        default:
            return `{ /* Set the return value! */ }`
    }
}

function getMapParameters(options: IActionWorkflowSchema) {
    switch(options.apiProperties) {
        case ApiProperties.Criteria:
            return `([_action, criteria)])`;
        case ApiProperties.PagedAndCriteria:
            return `([_action, pageInfo, criteria])`
        case ApiProperties.Paged:
            return `([_action, pageInfo])`;
        default:
            return '(_action)';
    }
}
export function configureEffectAddition(options: IActionWorkflowSchema) {
    const mapType = isRead(options) ? 'switchMap' : 'flatMap';
    const trigger = `StateActions.${options.actionPrefix}Trigger`;
    const success = `StateActions.${options.actionPrefix}Success`;
    const failure = `StateActions.${options.actionPrefix}Failure`;
    const mapArguments: any[] = doWithLatestFrom(options.apiProperties)
        ? [
            Helpers.line(`withLatestFrom(`, 2),
            ...(isPaged(options)
                ? [Helpers.line(`this.store.pipe(select(Selectors.${Helpers.getCurrentPageInfoSelectorName(options.name)})),`, 3)]
                : []
            ),
            ...(hasCriteria(options)
                ? [Helpers.line(`this.store.pipe(select(Selectors.${Helpers.getCriteriaSelectorName(options.name)}))`, 3)]
                : []
            ),
            Helpers.line(`),`, 2),
            Helpers.line(
                `${mapType}(${getMapParameters(options)} => {`, 2)
        ] : [Helpers.line(`${mapType}((_action) => {`, 2)];
    const lines = [
        Helpers.line(`public ${getEffectName(options)} = createEffect(() => this.actions.pipe(`),
        Helpers.line(`ofType(${trigger}),`, 2),
        ...mapArguments,
        Helpers.line(`return this.entityService.${options.apiMethodName}(${getEntityServiceArguments(options)}).pipe(`, 3),
        Helpers.line(`map((payload${getPayloadResponseType(options)}) => payload.errorMessage ? ${failure}() : ${success}(${getSuccessProps(options)})),`, 4),
        Helpers.line(`catchError(() => of(${failure}()))`, 4),
        Helpers.line(`);`, 3),
        Helpers.line(`})`, 2),
        Helpers.line(`));`)
    ];
    return `${Helpers.convertLines(lines)}\n`;
}
