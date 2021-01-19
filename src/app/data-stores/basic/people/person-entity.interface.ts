import { IPersonRequestDTO } from '@app/api-models';

export const selectPersonEntityId = (entity: IPersonEntity) => entity.id;

export interface IPersonName {
    first: string;
    last: string;
}

export interface IPersonEntity {
    id: string;
    name: IPersonName;
    email: string;
    gender: string;
    nationalityCode: string;
}

export interface IPersonEntityQueryCriteria extends IPersonRequestDTO { };
