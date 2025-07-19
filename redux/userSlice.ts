import { User } from "firebase/auth"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type UID = string | null

type UserState = {
  uid: UID
  isLoading: boolean
}

const initialState: UserState = {
  uid: null,
  isLoading: true,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initUserData: (state, action: PayloadAction<Pick<User, "uid">>) => {
      console.log("initUserData", action.payload)
      state.uid = action.payload.uid
      state.isLoading = false
    },
    clearUserData: (state) => {
      state.uid = null
      state.isLoading = false
    },
  },
})

export const { initUserData, clearUserData } = userSlice.actions
export const { reducer: user } = userSlice
