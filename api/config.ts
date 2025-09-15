import { firebaseAuth } from "@/firebase/config"

const baseUrl = `${process.env.EXPO_PUBLIC_API_URL}/cars`

type ApiErrorResponse = {
  error: string
}

type ApiDataResponse = {
  message: string
}

type ExecuteApiRequestProps = {
  path: "/incidents" | "/checks"
  method: "POST"
  payload: Record<string, unknown>
}

export const executeApiRequest = async <
  Response extends Record<string, unknown> = ApiDataResponse
>({
  path,
  method,
  payload,
}: ExecuteApiRequestProps) => {
  const request = async () => {
    const idToken = await firebaseAuth.currentUser?.getIdToken()

    console.log(`${baseUrl}${path}`)
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data: Response | ApiErrorResponse = await response.json()

    if (!response.ok) {
      throw new Error((data as ApiErrorResponse).error)
    }

    return data as Response
  }

  const result = await request()

  return result
}
