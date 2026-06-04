import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { postCheckAnswers, type PostCheckAnswersResponse } from "@/api/utils"

import { type Dispatch, type State } from "./config"
import { showToast } from "./toastSlice"

export type Answer = {
  label: string
  value: boolean
  details?: string
}

export type OdoReadingUnit = "km" | "miles"

export type OdoReading = {
  unit: OdoReadingUnit
  value: string
}

type AnswersState = {
  isLoading: boolean
  interior: Answer[]
  exterior: Answer[]
  odoReading: OdoReading | null
  startTimestamp: number
}

const initialState: AnswersState = {
  isLoading: false,
  interior: [],
  exterior: [],
  odoReading: null,
  startTimestamp: 0,
}

type AsyncThunkConfig = {
  state: State
  dispatch: Dispatch
  rejectValue: string
}

export const submitAnswers = createAsyncThunk<
  PostCheckAnswersResponse["checkId"],
  void,
  AsyncThunkConfig
>("answers/submit", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const { answers, cars } = getState()

    const response = await postCheckAnswers({
      interior: answers.interior,
      exterior: answers.exterior,
      odoReading: answers.odoReading as OdoReading,
      carId: cars.selectedCar.id,
      startTimestamp: answers.startTimestamp,
      endTimestamp: Date.now(),
    })

    dispatch(showToast("Check submitted successfully!"))

    return response.checkId
  } catch (error) {
    console.log(error)
    const errorMessage = (error as Error).message
    dispatch(showToast(errorMessage))

    return rejectWithValue(errorMessage)
  }
})

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    resetAnswers: (state) => {
      state.interior = []
      state.exterior = []
      state.odoReading = null
      state.startTimestamp = 0
    },
    setAnswer: (
      state,
      action: PayloadAction<{
        sectionKey: "interior" | "exterior"
        index: number
        answer: Answer
      }>,
    ) => {
      const { sectionKey, index, answer } = action.payload
      const existingDetails = state[sectionKey][index]?.details

      state[sectionKey][index] =
        !answer.value && existingDetails
          ? { ...answer, details: existingDetails }
          : answer
    },
    setOdoReading: (state, action: PayloadAction<OdoReading | null>) => {
      state.odoReading = action.payload
    },
    setAnswerDetails: (
      state,
      action: PayloadAction<{
        sectionKey: "interior" | "exterior"
        index: number
        details: string
      }>,
    ) => {
      const { sectionKey, index, details } = action.payload
      const answer = state[sectionKey][index]
      if (answer) {
        state[sectionKey][index] = { ...answer, details }
      }
    },
    initStartTimestamp: (state) => {
      state.startTimestamp = Date.now()
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
      state.startTimestamp = initialState.startTimestamp
    })
    builder.addCase(submitAnswers.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const {
  resetAnswers,
  setAnswer,
  setOdoReading,
  setAnswerDetails,
  initStartTimestamp,
} = answersSlice.actions
export const { reducer: answers } = answersSlice
