export type FiltersAction = [
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_START_DATE"; payload: number | null }
  | { type: "SET_END_DATE"; payload: number | null }
  | { type: "SET_CAR_ID"; payload: string }
]
