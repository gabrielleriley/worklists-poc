
export interface IUserDTO {
    id: string;
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