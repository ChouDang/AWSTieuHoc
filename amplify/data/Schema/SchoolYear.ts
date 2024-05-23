import { a } from "@aws-amplify/backend";

export const SchemaSchoolYear = () => ({
    SchoolYear: a.model({
        YearName: a.string(),
        Start: a.date(),
        End: a.date(),
        Status: a.enum(["Active", "Inactive"])
    })
        .authorization(allow => [allow.owner()]),
})
