import { Timestamp } from "firebase/firestore"

export type FiltersAction = [
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_START_DATE"; payload: Timestamp | null }
  | { type: "SET_END_DATE"; payload: Timestamp | null }
  | { type: "SET_CAR_ID"; payload: string }
]
