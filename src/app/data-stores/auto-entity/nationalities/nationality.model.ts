import { Key, Entity } from '@briebug/ngrx-auto-entity';

@Entity({
    modelName: 'NationalityAutoEntity',
})
export class NationalityAutoEntity {
    @Key code: string;
    name: string;
}