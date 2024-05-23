import type { Schema } from '../../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { SchoolYear } from '../../consts/types'

const client = generateClient<Schema>()

export const createTodo = async (_data: SchoolYear) => {
    await client.models.SchoolYear.create(_data)
}