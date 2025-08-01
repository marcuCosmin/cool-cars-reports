import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { postCheckAnswers } from "@/api/utils"

import { type Dispatch, type State } from "./config"
import { showToast } from "./toastSlice"

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

type AsyncThunkConfig = {
  state: State
  dispatch: Dispatch
  rejectValue: string
}

export const submitAnswers = createAsyncThunk<void, void, AsyncThunkConfig>(
  "answers/submit",
  async (_, { getState, dispatch }) => {
    try {
      const { answers, cars } = getState()

      const response = await postCheckAnswers({
        interior: answers.interior,
        exterior: answers.exterior,
        odoReading: answers.odoReading as OdoReading,
        carId: cars.selectedCar.id,
      })

      dispatch(showToast(response.message))
    } catch (error) {
      dispatch(showToast((error as Error).message))
    }
  }
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
