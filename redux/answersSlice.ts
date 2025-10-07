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
  faultsDetails: string
}

const initialState: AnswersState = {
  isLoading: false,
  interior: [],
  exterior: [],
  odoReading: null,
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
    })

    dispatch(showToast("Check submitted successfully!"))

    return response.checkId
  } catch (error) {
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
    setFaultsDetails: (state, action: PayloadAction<string>) => {
      state.faultsDetails = action.payload
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
    })
    builder.addCase(submitAnswers.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const { resetAnswers, setAnswer, setOdoReading, setFaultsDetails } =
  answersSlice.actions
export const { reducer: answers } = answersSlice
