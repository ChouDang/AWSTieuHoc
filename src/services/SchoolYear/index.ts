import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { SchoolYearUpdate } from '../../consts/types'
import React from 'react'
import { notification } from 'antd'

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

const actCheckHasActiveSchoolYear = async (_data:SchoolYearUpdate) => {
    let { data } = await ListSchoolYear()
    if (data.find(i => i.Status == "Active") && _data.Status == "Active") {
        notification.error({
            message: 'Thao tác thất bại',
            description: "Hiện đã có năm đang hoạt động không thể tạo",
            duration: 3,
        })
        return false
    }
    return true
}

export const CreateSchoolYear = async (_data: SchoolYearUpdate) => {
    if (await actCheckHasActiveSchoolYear(_data)) return await client.models.SchoolYear.create(_data)
}


export const UpdateSchoolYear = async (_data: SchoolYearUpdate) => {
    if (await actCheckHasActiveSchoolYear(_data)) return await client.models.SchoolYear.update(_data)
}


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
                    let newRow: SchoolYearUpdate = { ...i, inTrash: true, Status: 'Inactive' }
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
                    let newRow: SchoolYearUpdate = { ...i, inTrash: false, Status: 'Inactive' }
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


