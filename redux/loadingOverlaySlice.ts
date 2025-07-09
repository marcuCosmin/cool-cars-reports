import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type SelectedCarState = {
  isLoading: boolean
  text?: string
}

const initialState: SelectedCarState = {
  isLoading: false,
  text: undefined,
}

const loadingOverlaySlice = createSlice({
  name: "loadingOverlay",
  initialState,
  reducers: {
    showLoadingOverlay: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true
      state.text = action.payload
    },
    hideLoadingOverlay: (state) => {
      state.isLoading = false
      state.text = undefined
    },
  },
})

export const { hideLoadingOverlay, showLoadingOverlay } =
  loadingOverlaySlice.actions
export const { reducer: loadingOverlay } = loadingOverlaySlice
