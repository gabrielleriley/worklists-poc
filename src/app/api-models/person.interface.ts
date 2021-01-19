export interface IPersonDTO {
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
    nat: string;
    login: {
        uuid: string;
    }
}

export interface IPersonResultsDTO {
    results: IPersonDTO[]
}