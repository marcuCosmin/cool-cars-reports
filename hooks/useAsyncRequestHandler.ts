import { useCallback, useState } from "react"

import { useAppDispatch } from "@/redux/config"
import { showToast } from "@/redux/toastSlice"

type GenericRequest = (args?: any) => Promise<unknown>

type UseAsyncRequestHandlerProps<T extends GenericRequest> = {
  request: T
  isLoadingByDefault?: boolean
  successMessage?: string
}

export const useAsyncRequestHandler = <T extends GenericRequest>({
  request,
  successMessage,
  isLoadingByDefault = false,
}: UseAsyncRequestHandlerProps<T>) => {
  const [isLoading, setIsLoading] = useState(isLoadingByDefault)

  const dispatch = useAppDispatch()

  const handleAsyncRequest = useCallback(
    async (
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T> | undefined>> => {
      setIsLoading(true)
      try {
        const data = await request(...args)

        if (successMessage) {
          dispatch(showToast(successMessage))
        }

        return data as Awaited<ReturnType<T>>
      } catch (error) {
        console.log(error)
        const errorMessage = (error as Error).message
        dispatch(showToast(errorMessage))
      } finally {
        setIsLoading(false)
      }
    },
    [request, successMessage]
  )

  return { isLoading, handleAsyncRequest }
}
