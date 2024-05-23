import { Dayjs } from 'dayjs';

//========= Table Antd

//========= SchoolYear

export enum EnumSchoolYear {
    Active,
    Inactive,
}

export type SchoolYear = {
    YearName:string,
    Start: Date | Dayjs | string,
    End: Date | Dayjs | string,
    Status: EnumSchoolYear
}
