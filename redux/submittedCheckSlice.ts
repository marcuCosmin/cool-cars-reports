import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"

import { getCheckSubmittedToday } from "@/firebase/utils"

type SubmittedCheckState = {
  isLoading: boolean
  id: string
  error: string
}

const initialState: SubmittedCheckState = {
  isLoading: true,
  id: "",
  error: "",
}

export const fetchCheckSubmittedToday = createAsyncThunk(
  "submittedCheck/fetch",
  getCheckSubmittedToday
)

const submittedCheckSlice = createSlice({
  name: "submittedCheck",
  initialState,
  reducers: {
    setSubmittedCheckId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCheckSubmittedToday.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchCheckSubmittedToday.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ""

      if (action.payload) {
        state.id = action.payload.id
      } else {
        state.id = ""
      }
    })
    builder.addCase(fetchCheckSubmittedToday.rejected, (state) => {
      state.isLoading = false
      state.error = "Failed to execute the daily check verification"
      state.id = ""
    })
  },
})

export const { setSubmittedCheckId } = submittedCheckSlice.actions
export const { reducer: submittedCheck } = submittedCheckSlice
