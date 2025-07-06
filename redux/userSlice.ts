import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { User } from "firebase/auth"

type UID = string | null

type UserState = {
  uid: UID
  isLoading: boolean
}

const initialState: UserState = {
  uid: null,
  isLoading: false,
}

export const handleIDTokenChange = createAsyncThunk(
  "user/",
  (user: User | null) => {
    if (user) {
      return user.uid
    }

    return null
  }
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleIDTokenChange.fulfilled, (state, action) => {
      state.uid = action.payload
      state.isLoading = false
    })
  },
})

export const { reducer: user } = userSlice
