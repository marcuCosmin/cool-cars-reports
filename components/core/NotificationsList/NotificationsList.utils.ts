import { type RelativePathString } from "expo-router"

import { type Notification, type NotificationsFilters } from "@/firebase/utils"

import { Timestamp } from "firebase/firestore"
import type { FiltersAction } from "./NotificationsList.model"

type GetNotificationConfigProps = Pick<
  Notification,
  "reference" | "bulkCount" | "type"
> & {
  carId: string
}

export const getNotificationItemConfig = ({
  reference,
  type,
  carId,
  bulkCount = 1,
}: GetNotificationConfigProps) => {
  const redirectUrl =
    `/history/${carId}/${reference.path}/${reference.id}` as RelativePathString

  let message: string

  switch (type) {
    case "check":
      message = `Your check has been submitted successfully for car with registration number: ${carId}.`
      break
    case "fault":
      message = `You have reported ${bulkCount} ${
        bulkCount > 1 ? "faults" : "fault"
      } for car with registration number: ${carId}.`
      break
    case "incident":
      message = `You have reported an incident for car with registration number: ${carId}.`
      break
    default:
      message = `You have a new notification for car with registration number: ${carId}.`
  }

  return {
    redirectUrl,
    message,
  }
}

export const filtersReducer = (
  state: NotificationsFilters,
  action: FiltersAction[0]
) => {
  switch (action.type) {
    case "SET_TYPE":
      return {
        ...state,
        type: action.payload,
      }
    case "SET_START_DATE":
      return {
        ...state,
        startDate: action.payload,
      }
    case "SET_END_DATE":
      return {
        ...state,
        endDate: action.payload,
      }
    case "SET_CAR_ID":
      return {
        ...state,
        carId: action.payload,
      }
    default:
      return state
  }
}

const getEndTimestamp = () => {
  const currentDate = new Date()
  currentDate.setHours(23, 59, 59, 999)

  const endTimestamp = Timestamp.fromDate(currentDate)
  return endTimestamp
}

export const get1WeekTimestamps = () => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const currentWeek = new Date(currentDate)
  const dayOfWeek = currentDate.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  currentWeek.setDate(currentDate.getDate() - daysFromMonday)

  const startTimestamp = Timestamp.fromDate(currentWeek)
  const endTimestamp = getEndTimestamp()

  return { startTimestamp, endTimestamp }
}

export const get2WeeksTimestamps = () => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const startOfPrevWeek = new Date(currentDate)
  const dayOfWeekForTwoWeeks = currentDate.getDay()
  const daysFromMondayForTwoWeeks =
    dayOfWeekForTwoWeeks === 0 ? 6 : dayOfWeekForTwoWeeks - 1
  startOfPrevWeek.setDate(currentDate.getDate() - daysFromMondayForTwoWeeks - 7)

  const startTimestamp = Timestamp.fromDate(startOfPrevWeek)

  const endTimestamp = getEndTimestamp()

  return { startTimestamp, endTimestamp }
}

export const get1MonthTimestamps = () => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )

  const startTimestamp = Timestamp.fromDate(startOfMonth)

  const endTimestamp = getEndTimestamp()

  return { startTimestamp, endTimestamp }
}
