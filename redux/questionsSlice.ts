import { createSlice } from "@reduxjs/toolkit"

import { getQuestions, type QuestionDoc } from "@/firebase/utils"

import { createAppAsyncThunk } from "./utils"

type QuestionsState = QuestionDoc & {
  isLoading: boolean
}

const initialState: QuestionsState = {
  isLoading: true,
  interior: [],
  exterior: [],
}

export const fetchQuestions = createAppAsyncThunk(
  "questions/fetch",
  getQuestions
)

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
    })
  },
})

export const { reducer: questions } = questionsSlice
