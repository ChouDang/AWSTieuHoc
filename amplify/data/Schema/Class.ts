import { a } from "@aws-amplify/backend";

export const SchemaClass = () => ({
    Class: a.model({
        ClassName: a.string().required(),
        Grades: a.enum([ 
            "Khoi_1",
            "Khoi_2",
            "Khoi_3",
            "Khoi_4",
            "Khoi_5"
        ]) ,
        SchoolYearId: a.id(),
        SchoolYear: a.belongsTo("SchoolYear", "SchoolYearId"),
        inTrash: a.boolean(),
    })
        .authorization(allow => [ allow.publicApiKey().to(['read','create','delete','update']),]),
})