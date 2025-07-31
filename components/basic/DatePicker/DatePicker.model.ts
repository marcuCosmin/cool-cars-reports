import { Timestamp } from "firebase/firestore"

export type DatePickerProps = {
  label: string
  value: Timestamp | null
  onChange: (value: Timestamp) => void
}
