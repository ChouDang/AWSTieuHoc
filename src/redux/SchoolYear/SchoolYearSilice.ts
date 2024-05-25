import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SchoolYearUpdate } from '../../consts/types'
import { RootState } from '../store'
import { ListSchoolYear } from '../../services/SchoolYear'

export type LstSchoolYearCustom = {
    value: string,
    label: string,
} & SchoolYearUpdate

// Define a type for the slice state
export interface LstSchoolYear {
    LstSchoolYear: LstSchoolYearCustom[] | undefined
    SchoolYearSelect: string | undefined,
}

// Define the initial state using that type
const initialState: LstSchoolYear = {
    LstSchoolYear: [],
    SchoolYearSelect: ""
}

export const handleSchoolYearHubThunk = createAsyncThunk<
    LstSchoolYear | null,
    SchoolYearUpdate & { type: string },
    {
        state: RootState
    }
>('schoolyear/handleSchoolYearHubThunk', async (obj: SchoolYearUpdate & { type: string }, { getState, rejectWithValue }) => {

    let optObj = { ...obj, value: obj.id, label: obj.YearName }
    let { LstSchoolYear, SchoolYearSelect } = getState().schoolyear

    let newLstSchoolYear: any = []
    let newSchoolYearSelect: string | undefined = ""

    switch (obj.type) {
        case "create":
            newLstSchoolYear = [optObj, ...(LstSchoolYear || [])];
            newSchoolYearSelect = obj.Status === "Active" ? obj.id : SchoolYearSelect;
            break;
        case "update":
            if (obj.inTrash) {
                newLstSchoolYear = LstSchoolYear?.filter(i => i.id !== obj.id) || [];
                newSchoolYearSelect = obj.Status === "Active" ? "" : SchoolYearSelect;
            } else {
                const { data } = await ListSchoolYear();
                newLstSchoolYear = data?.map(i => ({ ...i, value: i.id, label: i.YearName })) || [];
    
                if (obj.Status === "Active") {
                    newSchoolYearSelect = obj.id;
                } else if (obj.id === SchoolYearSelect) {
                    newSchoolYearSelect = "";
                } else {
                    newSchoolYearSelect = SchoolYearSelect;
                }
            }
            break;
        case "delete":
            newLstSchoolYear = LstSchoolYear;
            newSchoolYearSelect = obj.Status === "Active" ? "" : SchoolYearSelect;
            break;
        default:
            break;
    }

    return {
        LstSchoolYear: newLstSchoolYear,
        SchoolYearSelect: newSchoolYearSelect
    }
})

export const schoolyearSlice = createSlice({
    name: 'schoolyear',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateSchoolYearSelect: (state, action: PayloadAction<string | undefined>) => {
            state.SchoolYearSelect = action.payload
        },
        updateLstSchoolYear: (state, action: PayloadAction<LstSchoolYearCustom[] | undefined>) => {
            state.LstSchoolYear = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleSchoolYearHubThunk.fulfilled, (state, action) => {
                state.LstSchoolYear = action.payload?.LstSchoolYear
                state.SchoolYearSelect = action.payload?.SchoolYearSelect
            })
            .addCase(handleSchoolYearHubThunk.rejected, (state, action) => { })
    },
})

export const { updateLstSchoolYear, updateSchoolYearSelect } = schoolyearSlice.actions

export default schoolyearSlice.reducer