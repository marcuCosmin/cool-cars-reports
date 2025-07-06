import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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
  interior: Answer[]
  exterior: Answer[]
  odoReading: OdoReading | null
}

const initialState: SelectedCarState = {
  interior: [],
  exterior: [],
  odoReading: null,
}

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
})

export const { resetAnswers, setAnswer, setOdoReading } = answersSlice.actions
export const { reducer: answers } = answersSlice
