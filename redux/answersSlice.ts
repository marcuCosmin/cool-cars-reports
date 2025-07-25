import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { postCheckAnswers } from "@/api/utils"

import { createAppAsyncThunk } from "./utils"

export type Answer = {
  label: string
  value: boolean
}

export type OdoReadingUnit = "km" | "miles"

export type OdoReading = {
  unit: OdoReadingUnit
  value: string
}

type SelectedCarState = {
  isLoading: boolean
  interior: Answer[]
  exterior: Answer[]
  odoReading: OdoReading | null
}

const initialState: SelectedCarState = {
  isLoading: false,
  interior: [],
  exterior: [],
  odoReading: null,
}

export const submitAnswers = createAppAsyncThunk(
  "answers/submit",
  postCheckAnswers
)

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    resetAnswers: (state) => {
      state.interior = []
      state.exterior = []
      state.odoReading = null
    },
    setAnswer: (
      state,
      action: PayloadAction<{
        sectionKey: "interior" | "exterior"
        index: number
        answer: Answer
      }>
    ) => {
      const { sectionKey, index, answer } = action.payload

      state[sectionKey][index] = answer
    },
    setOdoReading: (state, action: PayloadAction<OdoReading | null>) => {
      state.odoReading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitAnswers.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(submitAnswers.fulfilled, (state) => {
      state.isLoading = false
      state.interior = []
      state.exterior = []
      state.odoReading = null
    })
    builder.addCase(submitAnswers.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const { resetAnswers, setAnswer, setOdoReading } = answersSlice.actions
export const { reducer: answers } = answersSlice
