import { a } from "@aws-amplify/backend";

export const SchemaTodo = () => ({
    Todo: a
        .model({
            content: a.string(),
        })
        .authorization(allow => [allow.owner()]),
})
