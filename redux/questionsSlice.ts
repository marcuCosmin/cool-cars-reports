import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getQuestions, type QuestionDoc } from "@/firebase/utils"

type QuestionsState = QuestionDoc & {
  isLoading: boolean
  error: string
}

const initialState: QuestionsState = {
  isLoading: true,
  interior: [],
  exterior: [],
  error: "",
}

export const fetchQuestions = createAsyncThunk("questions/fetch", getQuestions)

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ""

      if (!action.payload) {
        return
      }

      state.interior = action.payload.interior
      state.exterior = action.payload.exterior
    })
    builder.addCase(fetchQuestions.rejected, (state) => {
      state.isLoading = false
      state.interior = []
      state.exterior = []
      state.error = "Failed to fetch questions"
    })
  },
})

export const { reducer: questions } = questionsSlice
