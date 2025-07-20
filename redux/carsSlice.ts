import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getCars, type Car } from "@/firebase/utils"

import { createAppAsyncThunk } from "./utils"

type SelectedCarState = {
  isLoading: boolean
  selectedCar: Car
  carsList: Car[]
}

const initialState: SelectedCarState = {
  isLoading: true,
  selectedCar: {
    id: "",
  },
  carsList: [],
}

export const fetchCars = createAppAsyncThunk("cars/fetch", getCars)

const carsSlice = createSlice({
  name: "selectedCar",
  initialState,
  reducers: {
    setSelectedCar: (state, action: PayloadAction<string>) => {
      const car = state.carsList.find((car) => car.id === action.payload) as Car
      state.selectedCar = car
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCars.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchCars.fulfilled, (state, action) => {
      state.isLoading = true
      state.carsList = action.payload
    })
    builder.addCase(fetchCars.rejected, (state) => {
      state.isLoading = false
      state.carsList = []
    })
  },
})

export const { setSelectedCar } = carsSlice.actions
export const { reducer: cars } = carsSlice
