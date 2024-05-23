import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { SchoolYear } from '../../consts/types'

const client = generateClient<Schema>()

export const createTodo = async (_data: SchoolYear) => {
    await client.models.SchoolYear.create({
        YearName: "2024 - 2025",
        Start: new Date().toUTCString() ,
        End: new Date().toUTCString(),
        Status: "Active",
    })
}