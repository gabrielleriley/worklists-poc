import { IEntityState } from '@briebug/ngrx-auto-entity';
import { PersonAutoEntity } from './auto-entity/people';
import { personAutoReducer } from './auto-entity/people/person.state';
import { NationalityAutoEntity } from './auto-entity/nationalities';
import { nationalityAutoReducer } from './auto-entity/nationalities/nationality.state';

export interface IAppState {
    personAutoEntity: IEntityState<PersonAutoEntity>;
    nationalityAutoEntity: IEntityState<NationalityAutoEntity>;
}

export const appReducer = {
    personAutoEntity: personAutoReducer,
    nationalityAutoEntity: nationalityAutoReducer
}