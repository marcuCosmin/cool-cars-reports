import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import {
  type CheckAnswer,
  type OdoReading,
  type QuestionSection,
} from "@/firebase/utils"

import { postCheckAnswers, type PostCheckAnswersResponse } from "@/api/utils"

import { type Dispatch, type State } from "./config"
import { showToast } from "./toastSlice"

type AnswersState = {
  isLoading: boolean
  items: CheckAnswer[]
  odoReading: OdoReading | null
  startTimestamp: number
}

const initialState: AnswersState = {
  isLoading: false,
  items: [],
  odoReading: null,
  startTimestamp: 0,
}

type AnswerIdentifier = {
  section: QuestionSection
  label: string
}

const findAnswerIndex = (
  answers: CheckAnswer[],
  { section, label }: AnswerIdentifier,
): number =>
  answers.findIndex(
    (answer) => answer.section === section && answer.label === label,
  )

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
      answers: answers.items,
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
      state.items = []
      state.odoReading = null
      state.startTimestamp = 0
    },
    setAnswer: (state, action: PayloadAction<CheckAnswer>) => {
      const existingIndex = findAnswerIndex(state.items, action.payload)
      const existingDetails = state.items[existingIndex]?.details

      const nextAnswer =
        !action.payload.value && existingDetails
          ? { ...action.payload, details: existingDetails }
          : action.payload

      if (existingIndex === -1) {
        state.items.push(nextAnswer)
      } else {
        state.items[existingIndex] = nextAnswer
      }
    },
    setOdoReading: (state, action: PayloadAction<OdoReading | null>) => {
      state.odoReading = action.payload
    },
    setAnswerDetails: (
      state,
      action: PayloadAction<AnswerIdentifier & { details: string }>,
    ) => {
      const { details } = action.payload
      const existingIndex = findAnswerIndex(state.items, action.payload)

      if (existingIndex !== -1) {
        state.items[existingIndex] = {
          ...state.items[existingIndex],
          details,
        }
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
      state.items = []
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
