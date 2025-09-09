import { firebaseAuth } from "@/firebase/config"

const baseUrl = `${process.env.EXPO_PUBLIC_API_URL}/cars`

type ExecuteApiRequestProps = {
  path: "/incidents" | "/checks"
  method: "POST"
  payload: Record<string, unknown>
}

type ApiErrorResponse = {
  error: string
}

export type ApiDataResponse = {
  message: string
}

export const executeApiRequest = async ({
  path,
  method,
  payload,
}: ExecuteApiRequestProps) => {
  const request = async () => {
    const idToken = await firebaseAuth.currentUser?.getIdToken()

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data: ApiDataResponse | ApiErrorResponse = await response.json()

    if (!response.ok) {
      throw new Error((data as ApiErrorResponse).error)
    }

    return data as ApiDataResponse
  }

  const result = await request()

  return result
}
