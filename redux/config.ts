import { configureStore } from "@reduxjs/toolkit"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

import { answers } from "./answersSlice"
import { cars } from "./carsSlice"
import { questions } from "./questionsSlice"
import { toast } from "./toastSlice"
import { user } from "./userSlice"

export const store = configureStore({
  reducer: { user, cars, questions, answers, toast },
})

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export const useAppDispatch: () => Dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<State> = useSelector
