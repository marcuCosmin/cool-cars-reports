import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates"
import { useEffect, useState } from "react"
import { AppState } from "react-native"

export const useAppUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false)

  const checkAndApplyUpdates = async () => {
    const { isAvailable } = await checkForUpdateAsync()

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

  return { isUpdating }
}
