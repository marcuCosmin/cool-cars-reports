import { type RelativePathString } from "expo-router"

import {
  type Car,
  type Notification,
  type NotificationsFilters,
} from "@/firebase/utils"

import { type SelectOption } from "@/components/basic/Select"

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
    case "fault-resolved":
      message = `${bulkCount} ${
        bulkCount > 1 ? "faults have" : "fault has"
      } been resolved for car with registration number: ${carId}.`
      break
    case "incident":
      message = `You have reported an incident for car with registration number: ${carId}.`
      break
    case "incident-resolved":
      message = `An incident you reported for the car with registration number ${carId} has been resolved.`
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
        type: action.payload as NotificationsFilters["type"],
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

  const endTimestamp = currentDate.getTime()
  return endTimestamp
}

export const get1WeekTimestamps = () => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const currentWeek = new Date(currentDate)
  const dayOfWeek = currentDate.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  currentWeek.setDate(currentDate.getDate() - daysFromMonday)

  const startTimestamp = currentWeek.getTime()
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

  const startTimestamp = startOfPrevWeek.getTime()

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

  const startTimestamp = startOfMonth.getTime()

  const endTimestamp = getEndTimestamp()

  return { startTimestamp, endTimestamp }
}

export const getCarsSelectOptions = (carsList: Car[]) => {
  const carsSelectOptions: SelectOption[] = carsList.map(({ id }) => ({
    value: id,
  }))

  carsSelectOptions.unshift({ value: "all", label: "All" })

  return carsSelectOptions
}
