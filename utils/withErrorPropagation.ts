export const withErrorPropagation =
  <T extends (args?: any) => Promise<unknown>>(requestId: string, request: T) =>
  (...args: Parameters<T>) => {
    try {
      return request(...args) as ReturnType<T>
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request ${requestId} failed: ${error.message}`)
      }

      throw new Error(
        `${requestId}: An unknown error occurred while processing the request`
      )
    }
  }
