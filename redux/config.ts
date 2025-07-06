import { configureStore } from "@reduxjs/toolkit"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

import { answers } from "./answersSlice"
import { loadingOverlay } from "./loadingOverlaySlice"
import { questions } from "./questionsSlice"
import { selectedCar } from "./selectedCarSlice"
import { toast } from "./toastSlice"
import { user } from "./userSlice"

export const store = configureStore({
  reducer: { user, selectedCar, questions, answers, loadingOverlay, toast },
})

type State = ReturnType<typeof store.getState>
type Dispatch = typeof store.dispatch

export const useAppDispatch: () => Dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<State> = useSelector
