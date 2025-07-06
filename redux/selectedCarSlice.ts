import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type SelectedCarState = {
  selectedCar: string
}

const initialState: SelectedCarState = {
  selectedCar: "",
}

const selectedCarSlice = createSlice({
  name: "selectedCar",
  initialState,
  reducers: {
    setSelectedCar: (state, action: PayloadAction<string>) => {
      state.selectedCar = action.payload
    },
  },
})

export const { setSelectedCar } = selectedCarSlice.actions
export const { reducer: selectedCar } = selectedCarSlice
