import { a } from "@aws-amplify/backend";

export const SchemaSchoolYear = () => ({
    SchoolYear: a.model({
        YearName: a.string().required(),
        Start: a.date().required(),
        End: a.date().required(),
        Status: a.enum(["Active", "Inactive"]),
        inTrash: a.boolean(),
    })
        .authorization(allow => [allow.owner()]),
})