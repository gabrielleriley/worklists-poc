export enum UserSortColumnDTO {
    Email = 'email',
    FirstName = 'firstName',
    LastName = 'lastName',    
}

export interface IUserRequestDTO {
    nationalities: string[];
    genders: string[];
    lastName: string;
    sortColumn: UserSortColumnDTO;
    order: 'asc' | 'desc' | ''
}

export interface IUserDTO {
    id: string;
    gender: 'male' | 'female';
    name: {
        title: string;
        first: string;
        last: string;
    };
    email: string;
    dob: {
        date: Date;
        age: number;
    },
    phone: string;
    cell: string;
    nationality: string;
}

