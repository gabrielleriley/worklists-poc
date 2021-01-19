export enum PersonSortColumnDTO {
    Email = 'email',
    FirstName = 'firstName',
    LastName = 'lastName',    
}

export interface IPersonRequestDTO {
    nationalities: string[];
    genders: string[];
    lastName: string;
    sortColumn: PersonSortColumnDTO;
    order: 'asc' | 'desc' | ''
}
