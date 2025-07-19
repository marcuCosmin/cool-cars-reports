import { firebaseAuth } from "@/firebase/config"

import { useAppDispatch } from "@/redux/config"
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "@/redux/loadingOverlaySlice"
import { showToast } from "@/redux/toastSlice"

const baseUrl = process.env.EXPO_PUBLIC_API_URL

type ExecuteApiRequest = {
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  payload?: Record<string, unknown>
}

export const useApi = () => {
  const dispatch = useAppDispatch()

  const executeApiRequest = async ({
    path,
    method,
    payload,
  }: ExecuteApiRequest) => {
    const idToken = await firebaseAuth.currentUser?.getIdToken()

    const fallbackError = `An unknown error occurred while fetching data from ${path}`
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }

    if (payload) {
      requestOptions.body = JSON.stringify(payload)
    }

    dispatch(showLoadingOverlay())

    try {
      const response = await fetch(`${baseUrl}${path}`, requestOptions)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || fallbackError)
      }

      dispatch(showToast(data.message || "Action completed successfully"))

      return data
    } catch (error: unknown) {
      let displayedError = fallbackError

      if (error instanceof Error) {
        displayedError = error.message
      }

      dispatch(showToast(displayedError))
    } finally {
      dispatch(hideLoadingOverlay())
    }
  }

  return { executeApiRequest }
}
