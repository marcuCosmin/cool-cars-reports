import { type Answer, type OdoReading } from "@/redux/answersSlice"

import { executeApiRequest } from "./config"

type PostCheckAnswersPayload = {
  interior: Answer[]
  exterior: Answer[]
  odoReading: OdoReading
  carId: string
}
export type PostCheckAnswersResponse = {
  checkId: string
}
export const postCheckAnswers = (payload: PostCheckAnswersPayload) =>
  executeApiRequest<PostCheckAnswersResponse>({
    path: "/checks",
    method: "POST",
    payload,
  })

type PostIncidentPayload = {
  description: string
  carId: string
  checkId: string
}

export const postIncident = (payload: PostIncidentPayload) =>
  executeApiRequest({
    path: "/incidents",
    method: "POST",
    payload,
  })
