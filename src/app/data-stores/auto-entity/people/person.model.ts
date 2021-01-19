import { Key, Entity } from '@briebug/ngrx-auto-entity';

interface IPersonName {
    first: string;
    last: string;
}

@Entity({
    modelName: 'PersonAutoEntity',
})
export class PersonAutoEntity {
    @Key id: string;
    name: IPersonName;
    email: string;
    gender: string;
    nationalityCode: string;
}