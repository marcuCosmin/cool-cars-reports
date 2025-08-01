import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"

import { getCars, type Car } from "@/firebase/utils"

type SelectedCarState = {
  isLoading: boolean
  selectedCar: Car
  carsList: Car[]
  error: string
}

const initialState: SelectedCarState = {
  isLoading: true,
  selectedCar: {
    id: "",
  },
  carsList: [],
  error: "",
}

export const fetchCars = createAsyncThunk("cars/fetch", getCars)

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
      state.error = ""
    })
    builder.addCase(fetchCars.rejected, (state) => {
      state.isLoading = false
      state.carsList = []
      state.error = "Failed to fetch cars"
    })
  },
})

export const { setSelectedCar } = carsSlice.actions
export const { reducer: cars } = carsSlice
