import { Injectable, Inject } from "@angular/core";
import { createEffectsHelperToken, EntityEffectsHelper } from '@app/data-stores/loadable-entity';
import { IUserEntity } from './user.entity';
import { userStateName } from './user.state';
import { UserAction } from './user.actions';

export const userEffectsHelperToken = createEffectsHelperToken(userStateName);

@Injectable()
export class UserEntityEffects {
    constructor(@Inject(userEffectsHelperToken) private helper: EntityEffectsHelper<IUserEntity>) { }
    
    public load$ = this.helper.createEntityLoadPageEffect({
        triggerAction: UserAction.fetchPage,
        successAction: UserAction.fetchPageSuccess,
        errorAction: UserAction.fetchPageError
    });

    public deleteByKey$ = this.helper.createEntityDeleteByKeyEffect({
        triggerAction: UserAction.deleteByKey,
        successAction: UserAction.deleteByKeySuccess,
        errorAction: UserAction.deleteByKeyError
    });
    
    public refetch$ = this.helper.createRefetchPageEffect([
        UserAction.deleteByKeySuccess,
        UserAction.refetch
    ], UserAction.fetchPage);
}