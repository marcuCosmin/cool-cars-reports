import { Timestamp } from "firebase/firestore"

export const parseTimestampForDisplay = (timestamp: Timestamp) => {
  const date = timestamp.toDate()

  const parsedTimestamp = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  return parsedTimestamp
}
