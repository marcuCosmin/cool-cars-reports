import { type RelativePathString } from "expo-router"

import { type Notification } from "@/firebase/utils"

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
