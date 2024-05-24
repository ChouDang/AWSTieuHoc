import { configureStore, Tuple } from '@reduxjs/toolkit'
import { homeSlice } from './Home/HomeSlice'
import { userSlice } from './User/UserSilice'
import { schoolyearSlice } from './SchoolYear/SchoolYearSilice'
import logger from 'redux-logger'
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    home: homeSlice.reducer,
    schoolyear: schoolyearSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch