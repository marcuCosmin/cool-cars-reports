import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type SelectedCarState = {
  id: string
}

const initialState: SelectedCarState = {
  id: "",
}

const selectedCarSlice = createSlice({
  name: "selectedCar",
  initialState,
  reducers: {
    setSelectedCar: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
  },
})

export const { setSelectedCar } = selectedCarSlice.actions
export const { reducer: selectedCar } = selectedCarSlice
