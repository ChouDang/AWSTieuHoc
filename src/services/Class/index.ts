import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { ClassUpdate, EGrades } from '../../consts/types'
import React from 'react';

const clientClass = generateClient<Schema>()
const selectionSet = ["id", "ClassName", "Grades", "SchoolYearId", "inTrash"] as const;
export const ListClasses = async ( _schoolYearId = "") => await clientClass.models.Class.list({
    selectionSet,
    filter: {
        SchoolYearId: {
            eq: _schoolYearId
        },
        inTrash: {
            eq: false
        },
    }
})

export const ListClassesByGrade = async (_eKhoi = EGrades.Khoi_1, _schoolYearId = "") => await clientClass.models.Class.list({
    selectionSet,
    filter: {
        SchoolYearId: {
            eq: _schoolYearId
        },
        Grades: {
            eq: _eKhoi
        },
        inTrash: {
            eq: false
        },
    }
})


export const ListClassesInTrash = async (_schoolYearId = "") => await clientClass.models.Class.list({
    selectionSet,
    filter: {
        SchoolYearId: {
            eq: _schoolYearId
        },
        inTrash: {
            eq: true
        },
    }
})

export const GetByIdClass = async (_id: string = "") => await clientClass.models.Class.get({ id: _id }, { selectionSet });

export const CreateClass = async (_data: ClassUpdate) => await clientClass.models.Class.create(_data)

export const UpdateClass = async (_data: ClassUpdate) => await clientClass.models.Class.update(_data)

export const DeleteClass = async (_id: string) => await clientClass.models.Class.delete({ id: _id })

export const DeleteClasses = async (
    _lstId: React.Key[] | string[] = [],
    _schoolYearId: string = ""
) => {
    try {
        let { data } = await ListClassesInTrash(_schoolYearId)
        if (data.length) {
            await Promise.all(data.map(async (i) => {
                await DeleteClass(i.id);
            }));
        }
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}

export const DeleteClassToTrash = async (
    _lstId: string[] | React.Key[],
    _schoolYearId: string = ""
) => {
    try {
        let { data } = await ListClasses(_schoolYearId)
        if (data.length) {
            await Promise.all(data.map(async (i) => {
                if (_lstId.includes(i.id)) {
                    let newRow: ClassUpdate = { ...i, inTrash: true }
                    return await UpdateClass({ ...newRow })
                }
            }));
        }
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}

export const RestoreTrashToClasses = async (
    _lstId: React.Key[] | string[] = [],
    _schoolYearId: string = ""
) => {
    try {
        let { data } = await ListClassesInTrash(_schoolYearId)
        if (data.length) {
            await Promise.all(data.map(async (i) => {
                if (_lstId.includes(i.id)) {
                    let newRow: ClassUpdate = { ...i, inTrash: false }
                    await UpdateClass({ ...newRow })
                }
            }));
        }
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}