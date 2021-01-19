import { PersonAutoEntity } from '@app/data-stores/auto-entity/people';
import { NationalityAutoEntity } from '@app/data-stores/auto-entity/nationalities';
import { IPersonEntity } from '@app/data-stores/basic/people';
import { INationalityEntity } from '@app/data-stores/basic/nationalities';


export interface IPersonSearchForm {
    nationalities: string[];
    genders: string[];
    lastName: string;
    selections: string[]
}

export interface IPersonTableRow {
    id: string;
    firstName: string;
    lastName: string;
    nationality: string;
}

export function mapAutoEntitiesToVM(people: PersonAutoEntity[], nationalities: NationalityAutoEntity[]): IPersonTableRow[] {
    return people.map((p) => ({
        id: p.id,
        firstName: p.name.first,
        lastName: p.name.last,
        nationality: nationalities.find((n) => n.code === p.nationalityCode).name,
        email: p.email
    }));
}

export function mapEntitiesToVM(people: IPersonEntity[], nationalities: INationalityEntity[]) {
    return people.map((p) => ({
        id: p.id,
        firstName: p.name.first,
        lastName: p.name.last,
        nationality: nationalities.find((n) => n.code === p.nationalityCode)?.name,
        email: p.email
    }));
}