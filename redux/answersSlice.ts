import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { postCheckAnswers, type PostCheckAnswersResponse } from "@/api/utils"

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

type AnswersState = {
  isLoading: boolean
  interior: Answer[]
  exterior: Answer[]
  odoReading: OdoReading | null
  startTimestamp: number
  faultsDetails: string
}

const initialState: AnswersState = {
  isLoading: false,
  interior: [],
  exterior: [],
  odoReading: null,
  startTimestamp: 0,
  faultsDetails: "",
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
      faultsDetails: answers.faultsDetails,
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
      state.faultsDetails = ""
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

      state[sectionKey][index] = answer
    },
    setOdoReading: (state, action: PayloadAction<OdoReading | null>) => {
      state.odoReading = action.payload
    },
    setFaultsDetails: (state, action: PayloadAction<string>) => {
      state.faultsDetails = action.payload
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
      state.faultsDetails = ""
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
  setFaultsDetails,
  initStartTimestamp,
} = answersSlice.actions
export const { reducer: answers } = answersSlice
