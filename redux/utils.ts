import { createAsyncThunk } from "@reduxjs/toolkit"
import { showToast } from "./toastSlice"

export const createAppAsyncThunk = <T extends (args: any) => Promise<any>>(
  typePrefix: string,
  asyncCallback: T
) => {
  const asyncThunk = createAsyncThunk(
    typePrefix,
    async (args: Parameters<T>[0], { dispatch, rejectWithValue }) => {
      try {
        return await asyncCallback(args)
      } catch (error) {
        const errorMessage = (error as Error).message

        dispatch(showToast(errorMessage))

        return rejectWithValue(errorMessage)
      }
    }
  )

  return asyncThunk
}
