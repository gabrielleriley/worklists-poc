export interface IUserEntity {
    id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    gender: string;
    nationalityCode: string;
}


export interface IUserQueryCriteria {
    sortColumn: string;
    direction: string;
    nationalities: string[];
    genders: string[];
    lastName: string;
}

