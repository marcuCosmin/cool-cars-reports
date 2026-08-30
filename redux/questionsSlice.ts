import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getQuestions, type Question } from "@/firebase/utils"

type QuestionsState = {
  isLoading: boolean
  items: Question[]
  error: string
}

const initialState: QuestionsState = {
  isLoading: true,
  items: [],
  error: "",
}

const FETCH_ERROR = "Failed to fetch questions"

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

      if (!action.payload) {
        state.items = []
        state.error = FETCH_ERROR

        return
      }

      state.items = action.payload.questions
      state.error = ""
    })
    builder.addCase(fetchQuestions.rejected, (state) => {
      state.isLoading = false
      state.items = []
      state.error = FETCH_ERROR
    })
  },
})

export const { reducer: questions } = questionsSlice
