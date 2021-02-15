export const selectUserId = (entity) => entity.id;

export interface IUserEntity {
    id: string | number;
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    dob: Date;
    email: string;
    nationality: string;
}


export interface IUserQueryCriteria {
    sortColumn: string;
    direction: string;
    gender: string;
    lastName: string;
    email: string;
    nationalities: string[];
}   
