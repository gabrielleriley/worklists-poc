import { PersonAutoEntity } from './person.model';
import { IPersonDTO } from '@app/api-models';

export function personDtoToEntity(dto: IPersonDTO): PersonAutoEntity {
    return {
        id: dto.login.uuid,
        name: {
            first: dto.name.first,
            last: dto.name.last,
        },
        email: dto.email,
        gender: dto.gender,
        nationalityCode: dto.nat
    }
}