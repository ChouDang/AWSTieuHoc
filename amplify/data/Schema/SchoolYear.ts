import { a } from "@aws-amplify/backend";

export const SchemaSchoolYear = () => ({
    SchoolYear: a.model({
        YearName: a.string(),
        Start: a.date(),
        End: a.date(),
        Status: a.enum(["Active", "Inactive"]),
        inTrash: a.boolean(),
    })
        .authorization(allow => [allow.owner()]),
})