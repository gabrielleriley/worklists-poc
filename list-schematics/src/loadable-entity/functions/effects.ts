import { strings } from '@angular-devkit/core';
import { IOptions } from '../loadable-entity.options';

function createLoadPageEffect(name: string) {
    return `public load$ = this.helper.createEntityLoadPageEffect({
        triggerAction: ${strings.classify(name)}Action.fetchPage,
        successAction: ${strings.classify(name)}Action.fetchPageSuccess,
        errorAction: ${strings.classify(name)}Action.fetchPageError
    });

    `;
}

function createRefetchEffect(options: IOptions) {
    const triggerEffects = [
        ...(options.deleteByKey) ? [`${strings.classify(options.name)}Action.deleteByKeySuccess`] : [],
        `${strings.classify(options.name)}Action.refetch`
    ].join(
        `,
        `);
    const fetchType = options.paginated ? 'Page' : 'All';
    return `public refetch$ = this.helper.createRefetch${fetchType}Effect([
        ${triggerEffects}
    ], ${strings.classify(options.name)}Action.fetch${fetchType});
    
    `;
}

function createLoadAllEffect(name: string) {
    return `public load$ = this.helper.createEntityLoadAllEffect({
        triggerAction: ${strings.classify(name)}Action.fetchAll,
        successAction: ${strings.classify(name)}Action.fetchAllSuccess,
        errorAction: ${strings.classify(name)}Action.fetchAllError
    });
    
    `;
}

function createDeleteByKeyEffect(name: string) {
    return `public deleteByKey$ = this.helper.createEntityDeleteByKeyEffect({
        triggerAction: ${strings.classify(name)}Action.deleteByKey,
        successAction: ${strings.classify(name)}Action.deleteByKeySuccess,
        errorAction: ${strings.classify(name)}Action.deleteByKeyError
    });
    
    `;
}

export function createEffect(options: IOptions) {
    let effects = '';
    if (options.read && options.paginated) {
        effects += createLoadPageEffect(options.name);
    }
    if (options.read && !options.paginated) {
        effects += createLoadAllEffect(options.name);
    }
    if (options.deleteByKey) {
        effects += createDeleteByKeyEffect(options.name);
    }
    if (options.read) {
        effects += createRefetchEffect(options);
    }
    return effects.trim();
}
