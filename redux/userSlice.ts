import { User } from "firebase/auth"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type UserState = {
  uid: string
  isLoading: boolean
}

const initialState: UserState = {
  uid: "",
  isLoading: true,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initUserData: (state, action: PayloadAction<Pick<User, "uid">>) => {
      state.uid = action.payload.uid
      state.isLoading = false
    },
    clearUserData: (state) => {
      state.uid = ""
      state.isLoading = false
    },
  },
})

export const { initUserData, clearUserData } = userSlice.actions
export const { reducer: user } = userSlice
