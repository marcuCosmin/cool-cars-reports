import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ToastState = {
  message: string
}

const initialState: ToastState = {
  message: "",
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    hideToast: (state) => {
      state.message = ""
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
  },
})

export const { showToast, hideToast } = toastSlice.actions
export const { reducer: toast } = toastSlice
