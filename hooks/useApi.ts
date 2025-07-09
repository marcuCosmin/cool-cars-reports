import { useAppDispatch, useAppSelector } from "@/redux/config"
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "@/redux/loadingOverlaySlice"
import { showToast } from "@/redux/toastSlice"

const baseUrl = "https://api.cool-cars-garage.co.uk"

type ExecuteApiRequest = {
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  payload?: Record<string, unknown>
}

export const useApi = () => {
  const { uid } = useAppSelector(({ user }) => user)
  const dispatch = useAppDispatch()

  const executeApiRequest = async ({
    path,
    method,
    payload,
  }: ExecuteApiRequest) => {
    const fallbackError = `An unknown error occurred while fetching data from ${path}`
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${uid}`,
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

      dispatch(showToast("Data fetched successfully!"))

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
