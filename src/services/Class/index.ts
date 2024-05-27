import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { ClassUpdate, EGrades } from '../../consts/types'

const clientClass = generateClient<Schema>()
const selectionSet = ["id", "ClassName", "Grades", "SchoolYearId", "inTrash"] as const;
export const ListClasses = async () => await clientClass.models.Class.list({
    selectionSet,
    filter: {
        inTrash: {
            eq: false
        },
    }
})

export const ListClassesByGrade = async (_eKhoi = EGrades.Khoi_1, _schoolYearId = "") => await clientClass.models.Class.list({
    selectionSet,
    filter: {
        SchoolYearId: {
            eq:_schoolYearId
        },
        Grades: {
            eq: _eKhoi
        },
        inTrash: {
            eq: false
        },
    }
})


export const ListClassesInTrash = async () => await clientClass.models.Class.list({
    selectionSet,
    filter: {
        inTrash: {
            eq: true
        },
    }
})

export const GetByIdClass = async (_id: string = "") => await clientClass.models.Class.get({ id: _id }, { selectionSet });

export const CreateClass = async (_data: ClassUpdate) => await clientClass.models.Class.create(_data)

export const UpdateClass = async (_data: ClassUpdate) => await clientClass.models.Class.update(_data)

export const DeleteClass = async (_id: string) => await clientClass.models.Class.delete({ id: _id })
