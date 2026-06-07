import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates"
import { useEffect, useState } from "react"
import { AppState } from "react-native"

export const useAppUpdate = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(!__DEV__)
  const [isUpdating, setIsUpdating] = useState(false)

  const checkAndApplyUpdates = async () => {
    setIsCheckingForUpdate(true)

    const { isAvailable } = await checkForUpdateAsync()

    setIsCheckingForUpdate(false)

    if (!isAvailable) {
      return
    }

    setIsUpdating(true)

    await fetchUpdateAsync()
    await reloadAsync()
  }

  useEffect(() => {
    if (__DEV__) {
      return
    }

    checkAndApplyUpdates()

    const subscription = AppState.addEventListener("change", (appStatus) => {
      if (appStatus !== "active") {
        return
      }

      checkAndApplyUpdates()
    })

    return () => subscription.remove()
  }, [])

  return { isCheckingForUpdate, isUpdating }
}
