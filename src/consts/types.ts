//========= SchoolYear

export enum EnumSchoolYear {
    Active,
    Inactive,
}

export type SchoolYear = {
    id?: string,
    YearName:string,
    Start: Date | undefined | null,
    End: Date | undefined | null,
    Status: EnumSchoolYear 
}
