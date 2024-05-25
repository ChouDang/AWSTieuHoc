import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { AuthUser } from 'aws-amplify/auth'

type AuthUserCustom  = {
    SchoolName: string,
    SchoolLevel: number,
    Region: string,
    identityId: string,
} & AuthUser

// Define a type for the slice state
export interface UserState {
    UserInfo: AuthUserCustom | undefined
}

// Define the initial state using that type
const initialState: UserState = {
    UserInfo: undefined
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateUserInfoLogin: (state, action: PayloadAction<AuthUserCustom | undefined>) => {
            state.UserInfo = action.payload
        }
    }
})

export const { updateUserInfoLogin } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user.UserInfo

export default userSlice.reducer