import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { SchoolYearUpdate } from '../../consts/types'
import React from 'react'

const client = generateClient<Schema>()
const selectionSet = ["id", "YearName", "Start", "End", "Status", "inTrash"] as const;
export const ListSchoolYear = async (isGetModelUpdate = false) => await client.models.SchoolYear.list({
    ...(isGetModelUpdate && { selectionSet }),
    filter: {
        inTrash: {
            eq: false
        },
    }
})

export const ListSchoolYearInTrash = async () => await client.models.SchoolYear.list({
    selectionSet,
    filter: {
        inTrash: {
            eq: true
        },
    }
})

export const GetByIdSchoolYear = async (_id: string = "") => await client.models.SchoolYear.get({ id: _id }, { selectionSet: ["id", "YearName", "Start", "End", "Status"] });

export const CreateSchoolYear = async (_data: SchoolYearUpdate) => await client.models.SchoolYear.create(_data)

export const UpdateSchoolYear = async (_data: SchoolYearUpdate) => await client.models.SchoolYear.update(_data)

export const DeleteSchoolYear = async (_id: string = "") => {
    try {
        await client.models.SchoolYear.delete({ id: _id })
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}

export const DeleteSchoolYears = async (_lstId: React.Key[] | string[] = []) => {
    try {
        let { data } = await ListSchoolYearInTrash()
        if (data.length) {
            await Promise.all(data.map(async (i) => {
                await DeleteSchoolYear(i.id);
            }));
        }
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}

export const DelToTrashSchoolYear = async (_lstId: React.Key[] | string[] = []) => {
    try {
        let { data } = await ListSchoolYear(true)
        if (data.length) {
            await Promise.all(data.map(async (i) => {
                if (_lstId.includes(i.id)) {
                    let newRow: SchoolYearUpdate = { ...i, inTrash: true }
                    return await UpdateSchoolYear({ ...newRow })
                }
            }));
        }
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}

export const RestoreTrashToSchoolYear = async (_lstId: React.Key[] | string[] = []) => {
    try {
        let { data } = await ListSchoolYearInTrash()
        if (data.length) {
            await Promise.all(data.map(async (i) => {
                if (_lstId.includes(i.id)) {
                    let newRow: SchoolYearUpdate = { ...i, inTrash: false }
                    await UpdateSchoolYear({ ...newRow })
                }
            }));
        }
        return true
    } catch (error) {
        console.log(error, "error")
        return false
    }
}


