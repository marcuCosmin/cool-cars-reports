import { usePathname, useSegments } from "expo-router"

import { useAppSelector } from "@/redux/config"

export const useCarId = () => {
  const reportsCarId = useAppSelector(({ cars }) => cars.selectedCar.id)

  const pathname = usePathname()
  const segments = useSegments()

  const carIdSegmentIndex = segments.findIndex((segment) =>
    segment.startsWith("[carId]")
  )
  const urlCarId = pathname.split("/")[carIdSegmentIndex + 1]

  const displayedReportsCarId = pathname.startsWith("/reports")
    ? reportsCarId
    : null

  const carId = urlCarId || displayedReportsCarId

  return carId
}
