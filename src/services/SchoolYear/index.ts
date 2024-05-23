import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { SchoolYear } from '../../consts/types'
import React from 'react'

const client = generateClient<Schema>()

export const ListSchoolYear = async () => await client.models.SchoolYear.list({
    filter: {
        inTrash: {
            eq: false
        },
    }
})

export const GetByIdSchoolYear = async (_id: string = "") => await client.models.SchoolYear.get({ id: _id });

export const CreateSchoolYear = async (_data: SchoolYear) => await client.models.SchoolYear.create(_data)

export const UpdateSchoolYear = async (_data: SchoolYear) =>{
    console.log(_data, "_data check")
    return await client.models.SchoolYear.update(_data)
} 

export const DeleteSchoolYear = async (_id: string = "") => await client.models.SchoolYear.delete({ id: _id })

export const DeleteSchoolYears = async (_lstId: React.Key[] | string[] = []) => {
    let { data } = await ListSchoolYear()
    if (data.length) {
        data.forEach(async (i) => {
            await DeleteSchoolYear(i.id)
        })
    }
}

export const DelToTrashSchoolYear = async (_lstId: React.Key[] | string[] = []) => {
    let { data } = await ListSchoolYear()
    if (data.length) {
        data.forEach((i) => {
            if (_lstId.includes(i.id)) {
                i.inTrash = true
                UpdateSchoolYear({ ...i })
            }
        })
    }
}

export const RestoreTrashToSchoolYear = async (_lstId: React.Key[] | string[] = []) => {
    let { data } = await ListSchoolYear()
    if (data.length) {
        data.forEach(async (i) => {
            if (_lstId.includes(i.id)) {
                i.inTrash = false
                await UpdateSchoolYear({ ...i })
            }
        })
    }
}


