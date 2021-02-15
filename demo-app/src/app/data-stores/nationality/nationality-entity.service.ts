import { Injectable } from '@angular/core';
import { ILoadableEntityService } from '@app/data-stores/loadable-entity';
import {
    INationalityEntity
} from './nationality.entity';

// TODO: Implement me! All methods from the ILoadableEntityService are optional,
// but you must implement any methods that you have created actions for
@Injectable()
export class NationalityEntityService implements ILoadableEntityService<INationalityEntity> {

}